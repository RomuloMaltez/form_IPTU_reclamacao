"use client";

import { useState, useRef } from "react";
import { z } from "zod";
import SujeitoPassivoSection, { DadosSujeitoPassivo } from "@/components/SujeitoPassivoSection";
import DadosRequerenteSection, { DadosRequerente } from "@/components/DadosRequerenteSection";
import DadosImovelSection, { DadosImovel } from "@/components/DadosImovelSection";
import InformacoesImpugnacaoSection, { InformacoesImpugnacao } from "@/components/InformacoesImpugnacaoSection";
import { ImpugnacaoPDF } from "@/components/ImpugnacaoPDF";

// 1. Definição dos Erros
export type FormErrors = {
    nome?: string;
    cpfCnpj?: string;
    documentoIdentidade?: string;
    endereco?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cep?: string;
    cidadeUf?: string;
    whatsapp?: string;
    email?: string;
    telefone?: string;

    tipoRequerente?: string;
    nomeRequerente?: string;
    cpfRequerente?: string;
    enderecoRequerente?: string;
    numeroRequerente?: string;
    complementoRequerente?: string;
    bairroRequerente?: string;
    cepRequerente?: string;
    cidadeUfRequerente?: string;
    whatsappRequerente?: string;
    emailRequerente?: string;

    inscricaoImobiliaria?: string;
    enderecoImovel?: string;
    numeroImovel?: string;
    complementoImovel?: string;
    bairroImovel?: string;
    cepImovel?: string;
    cidadeUfImovel?: string;
    distritoImovel?: string;

    anoIPTU?: string;
    valorIPTUCobrado?: string;
    valorCorreto?: string;
    possuiProcessos?: string;
    numerosProcessos?: string;
    utilizacaoImovel?: string;
    motivoErroIPTU?: string;
    motivacaoPedido?: string;

};

// 2. Schema Zod de Validação
const formSchema = z.object({
    nome: z.string().min(1, "O nome ou razão social é obrigatório."),
    // Exigimos no mínimo 14 para CPF (com máscara) e até 18 para CNPJ
    cpfCnpj: z.string().min(14, "Informe um CPF ou CNPJ válido."),
    documentoIdentidade: z.string().optional(),
    endereco: z.string().min(1, "O endereço é obrigatório."),
    numero: z.string().min(1, "O número é obrigatório."),
    complemento: z.string().optional(),
    bairro: z.string().min(1, "O bairro é obrigatório."),
    cep: z.string().min(9, "Informe um CEP válido."),
    cidadeUf: z.string().min(1, "A cidade/UF é obrigatória."),
    whatsapp: z.string().min(14, "O WhatsApp é obrigatório com DDD."),
    email: z.string().min(1, "O e-mail é obrigatório.").email("Informe um e-mail válido."),
    telefone: z.string().optional(),

    tipoRequerente: z.enum(["proprioContribuinte", "procurador", "compromissario"], {
        errorMap: () => ({ message: "Selecione o tipo de requerente." })
    }),
    nomeRequerente: z.string().optional(),
    cpfRequerente: z.string().optional(),
    enderecoRequerente: z.string().optional(),
    numeroRequerente: z.string().optional(),
    complementoRequerente: z.string().optional(),
    bairroRequerente: z.string().optional(),
    cepRequerente: z.string().optional(),
    cidadeUfRequerente: z.string().optional(),
    whatsappRequerente: z.string().optional(),
    emailRequerente: z.string().optional(),

    inscricaoImobiliaria: z.string().min(1, "A Inscrição Imobiliária é obrigatória."),
    enderecoImovel: z.string().min(1, "O endereço do imóvel é obrigatório."),
    numeroImovel: z.string().min(1, "O número do imóvel é obrigatório."),
    complementoImovel: z.string().optional(),
    bairroImovel: z.string().min(1, "O bairro do imóvel é obrigatório."),
    cepImovel: z.string().min(9, "Informe um CEP válido para o imóvel."),
    cidadeUfImovel: z.string().optional(), // É readonly, não precisa de validação estrita
    distritoImovel: z.string().optional(),

    anoIPTU: z.string().min(4, "Informe um ano válido (ex: 2024)."),
    valorIPTUCobrado: z.string().min(1, "Informe o valor cobrado."),
    valorCorreto: z.string().min(1, "Informe o valor que considera correto."),
    possuiProcessos: z.enum(["sim", "nao"]),
    numerosProcessos: z.string().optional(),
    utilizacaoImovel: z.string().min(1, "Selecione a utilização do imóvel."),
    motivoErroIPTU: z.array(z.string()).min(1, "Selecione pelo menos um motivo para o erro."), // Array de checkboxes!
    motivacaoPedido: z.string().min(10, "A descrição deve conter pelo menos 10 caracteres."),

}).superRefine((data, ctx) => {
    // Se o usuário selecionou qualquer coisa diferente do próprio contribuinte...
    if (data.tipoRequerente !== "proprioContribuinte") {

        // ...nós disparamos os erros manualmente se os campos estiverem vazios!
        if (!data.nomeRequerente?.trim()) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["nomeRequerente"], message: "Nome do requerente é obrigatório." });
        }
        if (!data.cpfRequerente || data.cpfRequerente.length < 14) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["cpfRequerente"], message: "CPF válido é obrigatório." });
        }
        if (!data.enderecoRequerente?.trim()) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["enderecoRequerente"], message: "Endereço é obrigatório." });
        }
        if (!data.numeroRequerente?.trim()) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["numeroRequerente"], message: "Número é obrigatório." });
        }
        if (!data.bairroRequerente?.trim()) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["bairroRequerente"], message: "Bairro é obrigatório." });
        }
        if (!data.cepRequerente || data.cepRequerente.length < 9) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["cepRequerente"], message: "CEP válido é obrigatório." });
        }
        if (!data.cidadeUfRequerente?.trim()) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["cidadeUfRequerente"], message: "Cidade/UF é obrigatória." });
        }
        if (!data.whatsappRequerente || data.whatsappRequerente.length < 14) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["whatsappRequerente"], message: "Telefone/WhatsApp é obrigatório." });
        }
        if (!data.emailRequerente || !/^\S+@\S+\.\S+$/.test(data.emailRequerente)) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["emailRequerente"], message: "E-mail válido é obrigatório." });
        }
        if (data.possuiProcessos === "sim" && !data.numerosProcessos?.trim()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["numerosProcessos"],
                message: "Como você informou que possui processos, informe os números."
            });
        }
    }
});

export default function ImpugnacaoIptuPage() {

    const [errors, setErrors] = useState<FormErrors>({});

    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    const pdfRef = useRef<HTMLDivElement>(null);

    // 3. Estado do Sujeito Passivo
    const [dadosSujeito, setDadosSujeito] = useState<DadosSujeitoPassivo>({
        nome: "",
        cpfCnpj: "",
        documentoIdentidade: "",
        endereco: "",
        numero: "",
        complemento: "",
        bairro: "",
        cep: "",
        cidadeUf: "",
        whatsapp: "",
        email: "",
        telefone: "",
    });

    const [dadosRequerente, setDadosRequerente] = useState<DadosRequerente>({
        tipoRequerente: "proprioContribuinte",
        nomeRequerente: "", cpfRequerente: "", enderecoRequerente: "", numeroRequerente: "",
        complementoRequerente: "", bairroRequerente: "", cepRequerente: "", cidadeUfRequerente: "",
        whatsappRequerente: "", emailRequerente: "",
    });

    const [dadosImovel, setDadosImovel] = useState<DadosImovel>({
        inscricaoImobiliaria: "",
        enderecoImovel: "",
        numeroImovel: "",
        complementoImovel: "",
        bairroImovel: "",
        cepImovel: "",
        cidadeUfImovel: "Porto Velho/RO", // <--- Valor inicial pré-definido
        distritoImovel: "",
    });

    const [dadosInfo, setDadosInfo] = useState<InformacoesImpugnacao>({
        anoIPTU: "",
        valorIPTUCobrado: "",
        valorCorreto: "",
        possuiProcessos: "nao",
        numerosProcessos: "",
        utilizacaoImovel: "Residencial", // Valor padrão
        motivoErroIPTU: [], // Array vazio no início
        motivacaoPedido: "",
    });

    async function generatePdf() {
        if (!pdfRef.current) return;
        setIsGeneratingPdf(true);

        try {
            // Importa a biblioteca dinamicamente
            const html2pdf = (await import("html2pdf.js")).default;
            const element = pdfRef.current;

            const opt = {
                // Margens: Topo, Direita, Baixo, Esquerda (em mm)
                margin: [35, 10, 30, 10] as [number, number, number, number],
                filename: `impugnacao_iptu_${dadosSujeito.cpfCnpj.replace(/\D/g, '')}.pdf`,
                image: { type: 'jpeg' as const, quality: 0.98 },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    logging: true, // Ligar para debug, se necessário
                    scrollY: 0,
                    scrollX: 0,
                    windowWidth: element.scrollWidth // Ajuda o canvas a entender a largura real
                },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
                pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
            };

            const mesesExtenso = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
            const dataHoje = new Date();
            const dataAtualExtenso = `${dataHoje.getDate()} de ${mesesExtenso[dataHoje.getMonth()]} de ${dataHoje.getFullYear()}`;

            // MICRO-DELAY VITAL: Dá tempo para o DOM do React renderizar a ref completamente
            await new Promise((resolve) => setTimeout(resolve, 300));

            // CADEIA DE EVENTOS CONTÍNUA: 
            await (html2pdf()
                .set(opt)
                .from(element)
                .toPdf()
                .get('pdf')
                .then((pdf: any) => {
                    const totalPages = pdf.internal.getNumberOfPages();
                    for (let i = 1; i <= totalPages; i++) {
                        pdf.setPage(i);

                        // Desenha o cabeçalho timbrado
                        pdf.addImage('/semec-timbrado-cabecalho.png', 'PNG', 0, 0, 210, 30);

                        // Desenha o rodapé timbrado 
                        pdf.addImage('/semec-timbrado-rodape.png', 'PNG', 0, 297 - 15, 210, 15);

                        // Desenha os textos do rodapé oficial
                        pdf.setFontSize(8);
                        pdf.setTextColor(100, 100, 100);
                        pdf.text("Requerimento - Impugnação de Lançamento IPTU", 105, 275, { align: "center" });
                        pdf.text(`Documento gerado eletronicamente em ${dataAtualExtenso}`, 105, 279, { align: "center" });
                        pdf.text(`Página ${i} de ${totalPages}`, 105, 283, { align: "center" });
                    }
                }) as any)
                .save();

        } catch (error) {
            console.error("Erro ao gerar PDF:", error);
            alert("Erro ao gerar PDF. Verifique o console para mais detalhes.");
        } finally {
            setIsGeneratingPdf(false);
        }
    }

    function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = {
            ...dadosSujeito,
            ...dadosRequerente,
            ...dadosImovel,
            ...dadosInfo
        };

        // Executa a validação do Zod
        const result = formSchema.safeParse(formData);

        if (!result.success) {
            const formattedErrors = result.error.flatten().fieldErrors;

            // Transforma os arrays de erro do Zod em strings simples
            const firstErrors: Record<string, string> = {};
            for (const key in formattedErrors) {
                firstErrors[key] = formattedErrors[key as keyof typeof formattedErrors]?.[0] || "";
            }
            setErrors(firstErrors);

            // --- LÓGICA DE AUTO-SCROLL INTELIGENTE ---

            // 1. Ordem exata em que os campos aparecem na tela (de cima para baixo)
            const ordemDosCampos: (keyof FormErrors)[] = [
                // Sujeito Passivo e Requerente...
                "nome", "cpfCnpj", "documentoIdentidade", "endereco", "numero", "complemento", "bairro", "cep", "cidadeUf", "whatsapp", "email", "telefone",
                "tipoRequerente", "nomeRequerente", "cpfRequerente", "enderecoRequerente", "numeroRequerente", "complementoRequerente", "bairroRequerente", "cepRequerente", "cidadeUfRequerente", "whatsappRequerente", "emailRequerente",
                // Imóvel
                "inscricaoImobiliaria", "enderecoImovel", "numeroImovel", "complementoImovel", "bairroImovel", "cepImovel", "distritoImovel",
                // Informações
                "anoIPTU", "valorIPTUCobrado", "valorCorreto", "numerosProcessos", "utilizacaoImovel", "motivoErroIPTU", "motivacaoPedido"
            ];

            // 2. Encontra o PRIMEIRO campo da lista acima que contém um erro
            const primeiroCampoComErro = ordemDosCampos.find(campo => firstErrors[campo]);

            if (primeiroCampoComErro) {
                // 3. Procura o elemento HTML na tela pelo atributo 'name'
                // O setTimeout com 0ms garante que o React tenha tempo de renderizar a mensagem vermelha antes de rolar
                setTimeout(() => {
                    const elemento = document.querySelector(`[name="${primeiroCampoComErro}"]`) as HTMLElement;

                    if (elemento) {
                        // Rola a tela centralizando o elemento e tenta focar nele
                        elemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        elemento.focus();
                    } else {
                        // Fallback de segurança: se não achar o elemento, joga pro topo
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                }, 0);
            }

            return;
        }

        setErrors({});
        console.log("Validação Passou! Dados:", result.data);
        generatePdf();
    }

    // Substitua const dataAtual = new Date().toLocaleDateString("pt-BR"); por:
    const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const hoje = new Date();
    const dataAtual = `${hoje.getDate()} de ${meses[hoje.getMonth()]} de ${hoje.getFullYear()}`;

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl relative">

            {/* 4. OVERLAY DE CARREGAMENTO */}
            {isGeneratingPdf && (
                <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500 mb-6 shadow-lg"></div>
                    <h2 className="text-3xl font-bold text-white mb-3 tracking-wide drop-shadow-md">Gerando Documento...</h2>
                    <p className="text-gray-200 text-lg drop-shadow-sm">Aguarde, o seu PDF será baixado automaticamente.</p>
                </div>
            )}

            {/* 5. COMPONENTE OCULTO DO PDF */}
            <ImpugnacaoPDF
                ref={pdfRef}
                dadosSujeito={dadosSujeito}
                dadosRequerente={dadosRequerente}
                dadosImovel={dadosImovel}
                dadosInfo={dadosInfo}
            />

            <div className="bg-white rounded-lg shadow-lg p-6 md:p-10 border border-gray-200">

                {/* CABEÇALHO */}
                <div className="text-center mb-8">
                    <h1 className="text-gray-800 font-bold text-2xl md:text-3xl mb-1 tracking-tight">
                        REQUERIMENTO
                    </h1>
                    <h2 className="text-pv-green-600 font-bold text-xl md:text-2xl">
                        IMPUGNAÇÃO DE LANÇAMENTO IPTU
                    </h2>
                </div>

                {/* ALERTA DE ATENÇÃO */}
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md mb-8 shadow-sm">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-500 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-bold text-red-800 uppercase tracking-wide">Atenção</h3>
                            <div className="mt-1 text-sm text-red-700">
                                <p>Leia atentamente a orientação antes de preencher os campos abaixo e junte a documentação necessária. <strong>Utilize um requerimento por imóvel e por ano.</strong></p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-300 my-8" />

                {/* FORMULÁRIO */}
                <form onSubmit={handleSubmit}>

                    {/* CAMPO I */}
                    <SujeitoPassivoSection
                        value={dadosSujeito}
                        onChange={setDadosSujeito}
                        errors={errors}
                    />

                    {/* CAMPO II */}
                    <DadosRequerenteSection
                        value={dadosRequerente}
                        onChange={setDadosRequerente}
                        errors={errors}
                    />

                    {/* CAMPO III */}
                    <DadosImovelSection
                        value={dadosImovel}
                        onChange={setDadosImovel}
                        errors={errors}
                    />

                    {/* CAMPO IV */}
                    <InformacoesImpugnacaoSection
                        value={dadosInfo}
                        onChange={setDadosInfo}
                        errors={errors}
                    />

                    {/* === CAMPO V - DATA E ASSINATURA (Inserido diretamente aqui) === */}
                    <div className="mb-8 border border-gray-200 rounded-lg overflow-hidden shadow-lg">
                        <div className="bg-gray-100 px-4 py-3 rounded-t-md border-b border-gray-200">
                            <h5 className="text-sm md:text-base font-bold text-gray-800">
                                CAMPO V - DATA E ASSINATURA DO REQUERENTE
                            </h5>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-gray-700 text-justify mb-8 leading-relaxed">
                                Declaro que todas as informações prestadas são verdadeiras e estou ciente das leis aplicáveis, inclusive sobre crimes contra a ordem tributária.
                                Também autorizo o recebimento de notificações e intimações por meio do Domicílio Tributário Eletrônico (DTEL), WhatsApp e e-mail.
                                Por fim, declaro que tenho acesso ao DTEL. Caso ainda não tenha, <a href="https://gpi-trb.portovelho.ro.gov.br/ServerExec/acessoBase/?idPortal=dbde30ec-cf59-4803-9653-00121a704021" target="_blank" rel="noopener noreferrer" className="text-pv-blue-700 underline font-medium hover:text-pv-blue-900 transition">clique aqui</a> para fazer o credenciamento.
                            </p>

                            <p className="text-right text-sm font-medium text-gray-800 mb-12 pr-4">
                                Porto Velho, RO {dataAtual}.
                            </p>

                            <div className="text-center mt-12 mb-4">
                                <div className="border-b border-black w-full max-w-md mx-auto mb-2"></div>
                                <span className="text-sm font-bold text-gray-800">
                                    ASSINATURA DO REQUERENTE
                                </span>
                            </div>
                            <div className="bg-blue-50 p-3 mx-auto max-w-2xl rounded-md border border-blue-100 text-center">
                                <p className="text-sm text-blue-800 font-medium">
                                    <span className="font-bold">⚠️ Aviso:</span> A assinatura poderá ser feita de forma digital (via GOV.BR, SEI, ou outro meio certificado) diretamente no PDF gerado.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* BOTÃO DE GERAR PDF */}
                    <div className="text-center mt-8 mb-12">
                        <button
                            type="submit"
                            disabled={isGeneratingPdf}
                            className={`font-bold py-4 px-12 rounded-full shadow-xl transition-all transform hover:scale-105 flex justify-center items-center mx-auto
                            ${isGeneratingPdf ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white cursor-pointer'}`}
                        >
                            {isGeneratingPdf ? "PROCESSANDO..." : "GERAR PDF"}
                        </button>
                    </div>

                    {/* === CAIXA DE INSTRUÇÕES E AVISOS (Fora do formulário) === */}
                    <div className="bg-gray-50 border border-gray-200 p-6 md:p-8 rounded-lg mt-12 text-sm text-gray-800 shadow-sm">
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-6 border-b border-gray-300 pb-3">
                            ATENÇÃO PARA O PREENCHIMENTO E DOCUMENTAÇÃO NECESSÁRIA
                        </h3>

                        <div className="space-y-6">
                            {/* Bloco 1 */}
                            <div>
                                <h4 className="font-bold text-pv-blue-900 mb-2">COMO PREENCHER ELETRONICAMENTE O FORMULÁRIO:</h4>
                                <ol className="list-decimal pl-5 space-y-2 text-gray-700 marker:text-gray-500 marker:font-bold">
                                    <li>Se o campo da descrição da motivação do pedido for insuficiente, anexe uma petição em separada, em PDF, junto com o formulário preenchido;</li>
                                    <li>Digite com letras MAIÚSCULAS;</li>
                                    <li>O formulário deve estar assinado, preferencialmente com assinatura eletrônica. Utilize o serviço de assinatura eletrônica gratuitamente, pelo Gov.br, no link: <a href="https://www.gov.br/pt-br/servicos/assinatura-eletronica" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800 transition">Assinatura Eletrônica Gratuita</a>.</li>
                                </ol>
                            </div>

                            {/* Bloco 2 */}
                            <div>
                                <h4 className="font-bold text-pv-blue-900 mb-2">COMO ENVIAR O FORMULÁRIO E DEMAIS DOCUMENTOS:</h4>
                                <ol start={4} className="list-decimal pl-5 space-y-2 text-gray-700 marker:text-gray-500 marker:font-bold">
                                    <li>O formulário, assim como toda a documentação, deve estar em PDF legível;</li>
                                    <li>Cada documento deverá ser um arquivo de PDF. Ex.: RG/CPF um PDF; Certidão de Inteiro Teor um PDF;</li>
                                </ol>
                            </div>

                            {/* Bloco 3 */}
                            <div>
                                <h4 className="font-bold text-pv-blue-900 mb-2">DOCUMENTOS MÍNIMOS OBRIGATÓRIOS DAS PESSOAS:</h4>
                                <ol start={6} className="list-decimal pl-5 space-y-2 text-gray-700 marker:text-gray-500 marker:font-bold">
                                    <li>Documento de identificação oficial, em que conste o número do CPF;</li>
                                    <li>Comprovante de residência;</li>
                                    <li>Para representante legal/procurador, procuração com poderes de representação perante à Administração Pública para a prática do ato;</li>
                                    <li>Para compromissário, contrato de compra/venda do imóvel (comprou o imóvel, mas não registrou no cartório);</li>
                                    <li>Se o requerente for o cônjuge e não constar no Cadastro Imobiliário, anexar Inteiro Teor ou Certidão de Casamento;</li>
                                    <li>Para pessoa jurídica, contrato social e suas alterações, ou ato consolidado, Estatuto ou Ata de Constituição, com devido registro no órgão competente;</li>
                                </ol>
                            </div>

                            {/* Bloco 4 */}
                            <div>
                                <h4 className="font-bold text-pv-blue-900 mb-2">DOCUMENTOS MÍNIMOS OBRIGATÓRIOS DO IMÓVEL:</h4>
                                <ol start={12} className="list-decimal pl-5 space-y-2 text-gray-700 marker:text-gray-500 marker:font-bold">
                                    <li>No caso de divergência de área do terreno ou de propriedade, apresentar a Inteiro Teor atualizada do imóvel;</li>
                                    <li>No caso de divergência de dados coletados em vistoria ou em processo de obras, deve incluir os documentos que comprovem o alegado;</li>
                                    <li>No caso de divergência de área construída, padrão construtivo ou do tipo de construção e demais características do imóvel, apresentar croqui ou planta e fotos do imóvel com data;</li>
                                </ol>
                            </div>
                        </div>

                        {/* CAIXA AMARELA DE ALERTA FINAL */}
                        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-5 mt-8 rounded-r-md shadow-sm">
                            <h4 className="font-bold text-yellow-800 text-lg mb-1">ATENÇÃO</h4>
                            <h4 className="font-bold text-yellow-800 mb-4 uppercase tracking-wide">Para protocolizar a impugnação</h4>

                            <div className="space-y-3 text-sm text-yellow-900">
                                <p>Recolha a custa processual <a href="https://gpi-trb.portovelho.ro.gov.br/ServerExec/acessoBase/?idPortal=dbde30ec-cf59-4803-9653-00121a704021" target="_blank" rel="noopener noreferrer" className="font-bold underline hover:text-yellow-700">Tarifa Abertura Processo</a> junte o comprovante de pagamento ao formulário, em PDF.</p>
                                <p>Processo Eletrônico e-PMPV, envie a documentação em PDF para: <a href="mailto:dtr.serm.impugnacoes@portovelho.ro.gov.br" className="font-bold underline hover:text-yellow-700">dtr.serm.impugnacoes@portovelho.ro.gov.br</a></p>
                                <p>Acompanhamento do Processo Eletrônico e-PMPV, <a href="https://epmpv.portovelho.ro.gov.br/?a=consultaETCDF&f=formPrincipal" target="_blank" rel="noopener noreferrer" className="font-bold underline hover:text-yellow-700">Clique Aqui acompanhar e-Proc</a>.</p>

                                <hr className="border-yellow-300 my-4" />

                                <p>É obrigação do contribuinte informar alterações no imóvel dentro de 60 dias (Art. 227 da LC 878/21).</p>
                                <p>As alterações serão consideradas para cálculo do tributo imobiliário somente para o ano subsequente em diante (Art. 184 da LC 878/21). <a href="https://sapl.portovelho.ro.leg.br/norma/14805?display" target="_blank" rel="noopener noreferrer" className="font-bold underline hover:text-yellow-700">Clique Aqui e acesse a LC 878/21</a>.</p>

                                <hr className="border-yellow-300 my-4" />

                                <p className="font-bold text-red-800 bg-red-100 p-3 rounded border border-red-200">
                                    Importante gerar o DAM AVULSO e pagar o valor que considera correto para evitar a incidência de juros e correção monetária. Escolha o menu "taxas web" e depois "impugnação parcial lanc. IPTU".
                                </p>
                                <p>Se a insatisfação do valor do tributo cobrado é por motivo de desatualização cadastral, formalize o processo de Atualização Cadastral em vez de impugnação. <a href="https://form-padrao.vercel.app/" target="_blank" rel="noopener noreferrer" className="font-bold underline hover:text-yellow-700">Clique Aqui e acesse o requerimento específico</a>.</p>
                            </div>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    );
}