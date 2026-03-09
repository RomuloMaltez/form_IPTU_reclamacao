import { PDF_COLORS } from './pdf-styles';

export function makeSectionBlock(title: string, bodyContent: any) {
    return {
        margin: [0, 0, 0, 10],
        table: {
            widths: ['*'],
            body: [
                [{ text: title, style: 'sectionTitle', fillColor: PDF_COLORS.primaryBlue, border: [true, true, true, false], margin: [8, 5, 8, 5] }],
                [{ stack: Array.isArray(bodyContent) ? bodyContent : [bodyContent], border: [true, false, true, true], margin: [8, 6, 8, 8], borderColor: [PDF_COLORS.borderLight, PDF_COLORS.borderLight, PDF_COLORS.borderLight, PDF_COLORS.borderLight] }],
            ],
        },
        layout: { hLineColor: () => PDF_COLORS.borderLight, vLineColor: () => PDF_COLORS.borderLight },
    };
}

export function makeSectionBlockBreakable(title: string, bodyContent: any) {
    const items = Array.isArray(bodyContent) ? bodyContent : [bodyContent];
    return {
        margin: [0, 0, 0, 10],
        table: {
            widths: ['*'],
            body: [
                [{ text: title, style: 'sectionTitle', fillColor: PDF_COLORS.primaryBlue, border: [true, true, true, false], margin: [8, 5, 8, 5] }],
                [{ stack: items, border: [true, false, true, true], margin: [8, 6, 8, 8] }],
            ],
            dontBreakRows: false,
        },
        layout: { hLineColor: () => PDF_COLORS.borderLight, vLineColor: () => PDF_COLORS.borderLight },
    };
}

export function makeField(label: string, value: any) {
    return {
        columns: [
            { text: label + ':', style: 'fieldLabel', width: 'auto', noWrap: true },
            { text: ' ' + (value || ''), style: value ? 'fieldValue' : 'fieldEmpty' },
        ],
        columnGap: 4,
        margin: [0, 2, 0, 2],
    };
}

export function makeFieldGrid(fields: { label: string, value: any }[]) {
    const rows = [];
    for (let i = 0; i < fields.length; i += 2) {
        const left = fields[i];
        const right = fields[i + 1];
        rows.push({
            columns: [
                { stack: [makeField(left.label, left.value)], width: '50%' },
                right ? { stack: [makeField(right.label, right.value)], width: '50%' } : { text: '', width: '50%' },
            ],
            columnGap: 12,
            margin: [0, 2, 0, 2],
        });
    }
    return rows;
}

export function makeCheckItem(label: string, checked: boolean) {
    return {
        // Trocamos os caracteres especiais por colchetes que funcionam em 100% das fontes
        text: (checked ? '[ X ] ' : '[    ] ') + label,
        style: checked ? 'checkboxSelected' : 'checkboxUnselected',
        margin: [0, 2, 0, 2],
    };
}

// Assinatura única centralizada baseada no seu bloco de assinaturas
export function makeSingleSignatureBlock(nome: string, cpf: string) {
    return {
        columns: [
            { width: '*', text: '' },
            {
                width: 250,
                stack: [
                    { text: '', margin: [0, 28, 0, 0] },
                    { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 250, y2: 0, lineWidth: 0.8, lineColor: PDF_COLORS.textDark }], margin: [0, 0, 0, 3] },
                    { text: nome || '_________________________________', style: 'signatureLabel' },
                    { text: `CPF: ${cpf || '___.___.___-__'}`, style: 'signatureNote', margin: [0, 0, 0, 0] },
                    { text: 'Este documento pode ser assinado digitalmente pelo GOV, SEI ou por outro meio', style: 'signatureNote', margin: [0, 4, 0, 0] }
                ]
            },
            { width: '*', text: '' }
        ],
        margin: [0, 10, 0, 10]
    };
}

export function makeDocFooter(currentPage: number, pageCount: number, dataCriacao: string, docName: string) {
    return {
        margin: [40, 0, 40, 0],
        stack: [
            { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.4, lineColor: PDF_COLORS.borderLight }], margin: [0, 0, 0, 4] },
            {
                columns: [
                    { text: docName, style: 'footerText', alignment: 'left' },
                    { text: 'Pág. ' + currentPage + ' / ' + pageCount, style: 'footerText', alignment: 'right' },
                ],
            },
            { text: 'Documento gerado eletronicamente em ' + dataCriacao, style: 'footerNote', margin: [0, 2, 0, 0] },
        ],
    };
}