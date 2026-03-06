import React, { CSSProperties } from "react";

// --- ESTILOS FORNECIDOS PELO SEU PADRÃO ---
const pdfHeaderStyle: CSSProperties = {
    textAlign: "center",
    marginBottom: "18px",
    borderBottom: "2px solid #333",
    paddingBottom: "12px",
};

const pdfTitleStyle: CSSProperties = {
    fontSize: "17pt",
    marginBottom: "6px",
    margin: "20px 0 20px 0",
    color: "#000",
    fontWeight: 700,
    textAlign: "center"
};

const pdfSubTitleStyle: CSSProperties = {
    fontSize: "13pt",
    marginBottom: "4px",
    fontWeight: 400,
    color: "#333",
    textAlign: "center"
};

const pdfHeaderTextStyle: CSSProperties = {
    fontSize: "9pt",
    color: "#666",
};

const pdfSectionTitleStyle: CSSProperties = {
    background: "#333",
    color: "#fff",
    padding: "0 0 15px 5px",
    margin: "28px 0 2px 0", 
    fontSize: "11pt",
    fontWeight: 700,
};

const pdfFieldLineStyle: CSSProperties = {
    marginBottom: "6px",
    lineHeight: 1.6,
    fontSize: "10.5pt",
};

const pdfParagraphStyle: CSSProperties = {
    marginBottom: "10px",
    textAlign: "justify",
    fontSize: "10.5pt",
    lineHeight: 1.4,
};

const pdfSignatureAreaStyle: CSSProperties = {
    marginTop: "80px",
    textAlign: "center",
    paddingBottom: "20px",
};

const pdfSignatureLineStyle: CSSProperties = {
    borderTop: "1px solid #000",
    width: "300px",
    margin: "0 auto 8px",
};

// Estilo do contêiner contínuo (sem a altura fixa do A4 para permitir quebras dinâmicas)
const pdfContentLayerStyle: CSSProperties = {
    position: "relative",
    width: "190mm",
    margin: "0 auto",
    background: "transparent",
    fontFamily: "Arial, sans-serif",
    fontSize: "10.5pt",
    lineHeight: 1.4,
    color: "#000000",
};

// Componente que impede a quebra de página no meio de um bloco
const AvoidBreak = ({ children }: { children: React.ReactNode }) => (
    <div style={{ pageBreakInside: "avoid", breakInside: "avoid" }}>{children}</div>
);

// Props recebidas do formulário
type PdfProps = {
    dadosSujeito: any;
    dadosRequerente: any;
    dadosImovel: any;
    dadosInfo: any;
};

export const ImpugnacaoPDF = React.forwardRef<HTMLDivElement, PdfProps>(({ dadosSujeito, dadosRequerente, dadosImovel, dadosInfo }, ref) => {

    const meses = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    const hoje = new Date();
    const dataAtual = `${hoje.getDate()} de ${meses[hoje.getMonth()]} de ${hoje.getFullYear()}`;

    const formatarMotivos = (motivos: string[]) => {
        if (!motivos || motivos.length === 0) return "Nenhum selecionado";
        const map: Record<string, string> = {
            aliquota: "Alíquota", area: "Área do Imóvel", valor_venal: "Valor Venal", muro_calcada: "Muro/Calçada", outros: "Outros"
        };
        return motivos.map(m => map[m] || m).join(", ");
    };

    return (
        <div
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "0px",
                overflow: "hidden",
                opacity: 0,
                pointerEvents: "none"
            }}
        >
            <div ref={ref} style={pdfContentLayerStyle}>

                {/* CABEÇALHO PADRÃO SEMFAZ */}
                <AvoidBreak>
                    <div style={pdfHeaderStyle}>
                        <h1 style={pdfTitleStyle}>REQUERIMENTO</h1>
                        <h2 style={pdfSubTitleStyle}>IMPUGNAÇÃO DE LANÇAMENTO IPTU</h2>
                        <p style={pdfHeaderTextStyle}>Prefeitura Municipal de Porto Velho - Secretaria Municipal de Fazenda (SEMFAZ)</p>
                    </div>
                </AvoidBreak>

                {/* CAMPO I */}
                <AvoidBreak>
                    <div style={pdfSectionTitleStyle}>CAMPO I - DADOS DO SUJEITO PASSIVO</div>
                    <div style={pdfFieldLineStyle}><strong>Nome / Razão Social:</strong> {dadosSujeito.nome}</div>
                    <div style={pdfFieldLineStyle}><strong>CPF / CNPJ:</strong> {dadosSujeito.cpfCnpj} &nbsp;&nbsp;&nbsp; <strong>Doc. Identidade:</strong> {dadosSujeito.documentoIdentidade}</div>
                    <div style={pdfFieldLineStyle}><strong>Endereço:</strong> {dadosSujeito.endereco}, Nº {dadosSujeito.numero} {dadosSujeito.complemento ? ` - ${dadosSujeito.complemento}` : ''}</div>
                    <div style={pdfFieldLineStyle}><strong>Bairro:</strong> {dadosSujeito.bairro} &nbsp;&nbsp;&nbsp; <strong>CEP:</strong> {dadosSujeito.cep} &nbsp;&nbsp;&nbsp; <strong>Cidade/UF:</strong> {dadosSujeito.cidadeUf}</div>
                    <div style={pdfFieldLineStyle}><strong>WhatsApp:</strong> {dadosSujeito.whatsapp} &nbsp;&nbsp;&nbsp; <strong>Telefone:</strong> {dadosSujeito.telefone || '---'}</div>
                    <div style={pdfFieldLineStyle}><strong>E-mail:</strong> {dadosSujeito.email}</div>
                </AvoidBreak>

                {/* CAMPO II (Condicional) */}
                {/* CAMPO II */}
                <AvoidBreak>
                    <div style={pdfSectionTitleStyle}>CAMPO II - DADOS DO REQUERENTE</div>
                    
                    {dadosRequerente.tipoRequerente === "proprioContribuinte" ? (
                        <div style={pdfFieldLineStyle}>
                            <strong>TIPO DE REQUERENTE:</strong> O PRÓPRIO CONTRIBUINTE (Não é necessário preencher os dados repetidos)
                        </div>
                    ) : (
                        <>
                            <div style={pdfFieldLineStyle}><strong>Tipo:</strong> {dadosRequerente.tipoRequerente === "procurador" ? "Procurador ou Representante Legal" : "Compromissário/Posseiro"}</div>
                            <div style={pdfFieldLineStyle}><strong>Nome:</strong> {dadosRequerente.nomeRequerente}</div>
                            <div style={pdfFieldLineStyle}><strong>CPF:</strong> {dadosRequerente.cpfRequerente}</div>
                            <div style={pdfFieldLineStyle}><strong>Endereço:</strong> {dadosRequerente.enderecoRequerente}, Nº {dadosRequerente.numeroRequerente} {dadosRequerente.complementoRequerente ? ` - ${dadosRequerente.complementoRequerente}` : ''}</div>
                            <div style={pdfFieldLineStyle}><strong>Bairro:</strong> {dadosRequerente.bairroRequerente} &nbsp;&nbsp;&nbsp; <strong>CEP:</strong> {dadosRequerente.cepRequerente} &nbsp;&nbsp;&nbsp; <strong>Cidade/UF:</strong> {dadosRequerente.cidadeUfRequerente}</div>
                            <div style={pdfFieldLineStyle}><strong>Telefone/WhatsApp:</strong> {dadosRequerente.whatsappRequerente} &nbsp;&nbsp;&nbsp; <strong>E-mail:</strong> {dadosRequerente.emailRequerente}</div>
                        </>
                    )}
                </AvoidBreak>

                {/* CAMPO III */}
                <AvoidBreak>
                    <div style={pdfSectionTitleStyle}>CAMPO III - DADOS DO IMÓVEL OBJETO DO PEDIDO</div>
                    <div style={pdfFieldLineStyle}><strong>Inscrição Imobiliária:</strong> {dadosImovel.inscricaoImobiliaria}</div>
                    <div style={pdfFieldLineStyle}><strong>Endereço do Imóvel:</strong> {dadosImovel.enderecoImovel}, Nº {dadosImovel.numeroImovel} {dadosImovel.complementoImovel ? ` - ${dadosImovel.complementoImovel}` : ''}</div>
                    <div style={pdfFieldLineStyle}><strong>Bairro:</strong> {dadosImovel.bairroImovel} &nbsp;&nbsp;&nbsp; <strong>CEP:</strong> {dadosImovel.cepImovel}</div>
                    <div style={pdfFieldLineStyle}><strong>Cidade/UF:</strong> {dadosImovel.cidadeUfImovel} &nbsp;&nbsp;&nbsp; <strong>Distrito:</strong> {dadosImovel.distritoImovel || '---'}</div>
                </AvoidBreak>

                {/* CAMPO IV */}
                <AvoidBreak>
                    <div style={pdfSectionTitleStyle}>CAMPO IV - INFORMAÇÕES SOBRE A IMPUGNAÇÃO</div>
                    <div style={pdfFieldLineStyle}><strong>Ano do IPTU:</strong> {dadosInfo.anoIPTU}</div>
                    <div style={pdfFieldLineStyle}><strong>Valor Cobrado:</strong> R$ {dadosInfo.valorIPTUCobrado} &nbsp;&nbsp;&nbsp; <strong>Valor Correto:</strong> R$ {dadosInfo.valorCorreto}</div>
                    <div style={pdfFieldLineStyle}><strong>Possui processos anteriores?</strong> {dadosInfo.possuiProcessos.toUpperCase()} {dadosInfo.possuiProcessos === "sim" ? ` (Nºs: ${dadosInfo.numerosProcessos})` : ''}</div>
                    <div style={pdfFieldLineStyle}><strong>Utilização do Imóvel:</strong> {dadosInfo.utilizacaoImovel.toUpperCase()}</div>
                    <div style={pdfFieldLineStyle}><strong>Motivos do erro:</strong> {formatarMotivos(dadosInfo.motivoErroIPTU)}</div>
                </AvoidBreak>

                {/* MOTIVAÇÃO (Isolado para quebrar página livremente se necessário) */}
                <div style={{ marginTop: "15px" }}>
                    <div style={pdfFieldLineStyle}><strong>Descrição da Motivação Fática e de Direito:</strong></div>
                    <div style={{ ...pdfParagraphStyle, whiteSpace: "pre-wrap", border: "1px solid #ccc", padding: "10px", borderRadius: "4px", background: "#fafafa" }}>
                        {dadosInfo.motivacaoPedido}
                    </div>
                </div>

                {/* CAMPO V */}
                <AvoidBreak>
                    <div style={pdfSectionTitleStyle}>CAMPO V - DATA E ASSINATURA</div>
                    <p style={pdfParagraphStyle}>
                        Declaro que todas as informações prestadas são verdadeiras e estou ciente das leis aplicáveis, inclusive sobre crimes contra a ordem tributária. Também autorizo o recebimento de notificações e intimações por meio do Domicílio Tributário Eletrônico (DTEL), WhatsApp e e-mail.
                    </p>
                    <div style={{ textAlign: "right", marginTop: "40px", marginBottom: "50px", fontSize: "11pt" }}>
                        Porto Velho/RO, {dataAtual}.
                    </div>

                    <div style={pdfSignatureAreaStyle}>
                        <div style={pdfSignatureLineStyle}></div>
                        <strong>{dadosRequerente.tipoRequerente === "proprioContribuinte" ? dadosSujeito.nome : dadosRequerente.nomeRequerente || "_________________________________"}</strong>
                    </div>
                </AvoidBreak>

            </div>
        </div>
    );
});
ImpugnacaoPDF.displayName = "ImpugnacaoPDF";