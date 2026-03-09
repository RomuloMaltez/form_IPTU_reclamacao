export const PDF_COLORS = {
    primaryBlue: '#1e3a5f',
    accentGreen: '#70b643',
    accentYellow: '#f2c94c',
    textDark: '#374151',
    textMedium: '#6b7280',
    borderLight: '#e5e7eb',
    backgroundSection: '#f5f5f5',
    white: '#ffffff',
};

export const PDF_STYLES = {
    headerTitle: { fontSize: 13, bold: true, color: PDF_COLORS.primaryBlue, alignment: 'center' as const },
    headerSubtitle: { fontSize: 10, color: PDF_COLORS.primaryBlue, alignment: 'center' as const },
    headerCaption: { fontSize: 8, color: PDF_COLORS.textMedium, alignment: 'center' as const },

    docTitle: { fontSize: 13, bold: true, color: PDF_COLORS.accentGreen, alignment: 'center' as const, margin: [0, 0, 0, 10] },
    docIntro: { fontSize: 10, color: PDF_COLORS.textDark, margin: [0, 0, 0, 12] },

    sectionTitle: { fontSize: 9, bold: true, color: PDF_COLORS.white, fillColor: PDF_COLORS.primaryBlue },
    sectionBody: { margin: [0, 4, 0, 8] },

    fieldLabel: { fontSize: 9, bold: true, color: PDF_COLORS.primaryBlue },
    fieldValue: { fontSize: 9, color: PDF_COLORS.textDark },
    fieldEmpty: { fontSize: 9, color: PDF_COLORS.textMedium, italics: true },

    checkboxSelected: { fontSize: 9, bold: true, color: PDF_COLORS.primaryBlue },
    checkboxUnselected: { fontSize: 9, color: PDF_COLORS.textMedium },

    termoTitle: { fontSize: 8.5, bold: true, color: PDF_COLORS.textDark, margin: [0, 0, 0, 2] },
    termoItem: { fontSize: 7.5, color: PDF_COLORS.textDark, margin: [0, 1, 0, 1] },
    termoAceite: { fontSize: 8.5, bold: true, color: PDF_COLORS.primaryBlue, margin: [0, 4, 0, 0] },

    signatureLabel: { fontSize: 8, alignment: 'center' as const, color: PDF_COLORS.textMedium },
    signatureNote: { fontSize: 7, alignment: 'center' as const, color: PDF_COLORS.textMedium, italics: true, margin: [0, 4, 0, 0] },

    footerText: { fontSize: 7, color: PDF_COLORS.textMedium, alignment: 'center' as const },
    footerNote: { fontSize: 7, color: PDF_COLORS.textMedium, alignment: 'center' as const, italics: true },
};