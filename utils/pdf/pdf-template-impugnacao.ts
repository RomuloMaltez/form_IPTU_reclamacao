import { PDF_COLORS, PDF_STYLES } from './pdf-styles';
import { makeSectionBlock, makeSectionBlockBreakable, makeField, makeFieldGrid, makeCheckItem, makeSingleSignatureBlock, makeDocFooter } from './pdf-utils';

function _makeHeaderInstitucional() {
    return {
        margin: [0, 0, 0, 15],
        table: {
            widths: ['*'],
            body: [[{
                stack: [
                    { text: 'PREFEITURA MUNICIPAL DE PORTO VELHO', style: 'headerTitle' },
                    { text: 'SECRETARIA MUNICIPAL DE FAZENDA', style: 'headerSubtitle' },
                    { text: 'Subsecretaria da Receita Municipal', style: 'headerCaption' },
                ],
                fillColor: PDF_COLORS.backgroundSection,
                border: [false, false, false, true],
                borderColor: [null, null, null, PDF_COLORS.accentGreen],
                margin: [0, 10, 0, 10],
            }]],
        },
        layout: { hLineColor: () => PDF_COLORS.accentGreen, vLineColor: () => 'transparent' },
    };
}

export function createImpugnacaoDoc(data: any) {
    const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const hojeObj = new Date();
    const hoje = `${hojeObj.getDate()} de ${meses[hojeObj.getMonth()]} de ${hojeObj.getFullYear()}`;

    const reqNome = data.dadosRequerente.tipoRequerente === 'proprioContribuinte' ? data.dadosSujeito.nome : data.dadosRequerente.nomeRequerente;
    const reqCpf = data.dadosRequerente.tipoRequerente === 'proprioContribuinte' ? data.dadosSujeito.cpfCnpj : data.dadosRequerente.cpfRequerente;

    return {
        pageSize: 'A4',
        pageMargins: [40, 40, 40, 70],
        footer: function (currentPage: number, pageCount: number) {
            return makeDocFooter(currentPage, pageCount, hoje, 'Requerimento - Impugnação de Lançamento IPTU');
        },
        styles: PDF_STYLES,
        defaultStyle: { font: 'Roboto', fontSize: 9 },
        content: [
            _makeHeaderInstitucional(),
            { text: 'REQUERIMENTO – IMPUGNAÇÃO DE LANÇAMENTO IPTU', style: 'docTitle', margin: [0, 5, 0, 15] },

            // CAMPO I
            makeSectionBlock('CAMPO I - DADOS DO SUJEITO PASSIVO', [
                makeField('Nome / Razão Social', data.dadosSujeito.nome),
                ...makeFieldGrid([
                    { label: 'CPF / CNPJ', value: data.dadosSujeito.cpfCnpj },
                    { label: 'Doc. Identidade', value: data.dadosSujeito.documentoIdentidade },
                    { label: 'Endereço', value: data.dadosSujeito.endereco },
                    { label: 'Nº', value: data.dadosSujeito.numero },
                    { label: 'Complemento', value: data.dadosSujeito.complemento },
                    { label: 'Bairro', value: data.dadosSujeito.bairro },
                    { label: 'CEP', value: data.dadosSujeito.cep },
                    { label: 'Cidade/UF', value: data.dadosSujeito.cidadeUf },
                    { label: 'WhatsApp', value: data.dadosSujeito.whatsapp },
                    { label: 'Telefone', value: data.dadosSujeito.telefone },
                    { label: 'E-mail', value: data.dadosSujeito.email },
                ])
            ]),

            // CAMPO II
            makeSectionBlock('CAMPO II - DADOS DO REQUERENTE',
                data.dadosRequerente.tipoRequerente === 'proprioContribuinte'
                    ? [{ text: 'TIPO DE REQUERENTE: O PRÓPRIO CONTRIBUINTE (Não é necessário preencher os dados repetidos)', style: 'fieldValue', margin: [0, 4, 0, 4] }]
                    : [
                        makeField('Tipo', data.dadosRequerente.tipoRequerente === 'procurador' ? 'Procurador ou Representante Legal' : 'Compromissário/Posseiro'),
                        ...makeFieldGrid([
                            { label: 'Nome', value: data.dadosRequerente.nomeRequerente },
                            { label: 'CPF', value: data.dadosRequerente.cpfRequerente },
                            { label: 'Endereço', value: data.dadosRequerente.enderecoRequerente },
                            { label: 'Nº', value: data.dadosRequerente.numeroRequerente },
                            { label: 'Complemento', value: data.dadosRequerente.complementoRequerente },
                            { label: 'Bairro', value: data.dadosRequerente.bairroRequerente },
                            { label: 'CEP', value: data.dadosRequerente.cepRequerente },
                            { label: 'Cidade/UF', value: data.dadosRequerente.cidadeUfRequerente },
                            { label: 'WhatsApp', value: data.dadosRequerente.whatsappRequerente },
                            { label: 'E-mail', value: data.dadosRequerente.emailRequerente },
                        ])
                    ]
            ),

            // CAMPO III
            makeSectionBlock('CAMPO III - DADOS DO IMÓVEL OBJETO DO PEDIDO', [
                makeField('Inscrição Imobiliária', data.dadosImovel.inscricaoImobiliaria),
                ...makeFieldGrid([
                    { label: 'Endereço', value: data.dadosImovel.enderecoImovel },
                    { label: 'Nº', value: data.dadosImovel.numeroImovel },
                    { label: 'Complemento', value: data.dadosImovel.complementoImovel },
                    { label: 'Bairro', value: data.dadosImovel.bairroImovel },
                    { label: 'CEP', value: data.dadosImovel.cepImovel },
                    { label: 'Cidade/UF', value: data.dadosImovel.cidadeUfImovel },
                    { label: 'Distrito', value: data.dadosImovel.distritoImovel },
                ])
            ]),

            // CAMPO IV (Com suporte a quebra de página nativa)
            makeSectionBlockBreakable('CAMPO IV - INFORMAÇÕES SOBRE A IMPUGNAÇÃO', [
                ...makeFieldGrid([
                    { label: 'Ano do IPTU', value: data.dadosInfo.anoIPTU },
                    { label: 'Utilização do Imóvel', value: data.dadosInfo.utilizacaoImovel.toUpperCase() },
                    { label: 'Valor Cobrado (R$)', value: data.dadosInfo.valorIPTUCobrado },
                    { label: 'Valor Correto (R$)', value: data.dadosInfo.valorCorreto },
                ]),
                makeField('Possui processos anteriores?', data.dadosInfo.possuiProcessos === 'sim' ? `SIM (Nºs: ${data.dadosInfo.numerosProcessos})` : 'NÃO'),

                { text: 'Motivos do Erro:', style: 'fieldLabel', margin: [0, 8, 0, 4] },
                {
                    columns: [
                        { stack: [makeCheckItem('Alíquota', data.dadosInfo.motivoErroIPTU.includes('aliquota')), makeCheckItem('Valor Venal', data.dadosInfo.motivoErroIPTU.includes('valor_venal'))], width: '33%' },
                        { stack: [makeCheckItem('Área do Imóvel', data.dadosInfo.motivoErroIPTU.includes('area')), makeCheckItem('Muro/Calçada', data.dadosInfo.motivoErroIPTU.includes('muro_calcada'))], width: '33%' },
                        { stack: [makeCheckItem('Outros', data.dadosInfo.motivoErroIPTU.includes('outros'))], width: '33%' },
                    ]
                },

                { text: 'Descrição da Motivação Fática e de Direito:', style: 'fieldLabel', margin: [0, 10, 0, 4] },
                { text: data.dadosInfo.motivacaoPedido, style: 'fieldValue', alignment: 'justify', margin: [0, 0, 0, 4] }
            ]),

            // CAMPO V
            makeSectionBlockBreakable('CAMPO V - DATA E ASSINATURA', [
                { text: 'Declaro que todas as informações prestadas são verdadeiras e estou ciente das leis aplicáveis, inclusive sobre crimes contra a ordem tributária. Também autorizo o recebimento de notificações e intimações por meio do Domicílio Tributário Eletrônico (DTEL), WhatsApp e e-mail.', style: 'fieldValue', alignment: 'justify', margin: [0, 4, 0, 10] },
                { text: `Porto Velho/RO, ${hoje}`, style: 'fieldValue', alignment: 'right', margin: [0, 0, 0, 10] },
                makeSingleSignatureBlock(reqNome, reqCpf)
            ])
        ],
    };
}