"use client";

import React from "react";
import { FormErrors } from "../app/page";

export type InformacoesImpugnacao = {
    anoIPTU: string;
    valorIPTUCobrado: string;
    valorCorreto: string;
    possuiProcessos: "sim" | "nao";
    numerosProcessos: string;
    utilizacaoImovel: string; // "residencial", "misto", etc.
    motivoErroIPTU: string[]; // Como são checkboxes, salvamos em um array
    motivacaoPedido: string;
};

type Props = {
    value: InformacoesImpugnacao;
    onChange: (value: InformacoesImpugnacao) => void;
    errors: FormErrors;
};

export default function InformacoesImpugnacaoSection({ value, onChange, errors }: Props) {

    // --- MÁSCARAS ---
    // Aceita apenas números para o ano
    function formatAno(v: string) {
        return v.replace(/\D/g, "").slice(0, 4);
    }

    // Máscara simples para valor em Reais (permite números e vírgula)
    function formatMoeda(v: string) {
        let value = v.replace(/\D/g, "");
        if (value.length > 2) {
            value = value.replace(/(\d)(\d{2})$/, "$1,$2");
            // Adiciona pontos de milhar
            value = value.replace(/(?=(\d{3})+(\D))\B/g, ".");
        }
        return value;
    }

    // --- MANIPULADORES DE ESTADO ---
    function handleChange(field: keyof InformacoesImpugnacao, fieldValue: string) {
        let finalValue = fieldValue;
        if (field === "anoIPTU") finalValue = formatAno(fieldValue);
        else if (field === "valorIPTUCobrado" || field === "valorCorreto") finalValue = formatMoeda(fieldValue);
        
        onChange({ ...value, [field]: finalValue });
    }

    // Lógica para marcar/desmarcar múltiplos checkboxes
    function handleCheckboxChange(motivo: string) {
        const currentMotivos = value.motivoErroIPTU;
        if (currentMotivos.includes(motivo)) {
            // Se já tem, remove
            onChange({ ...value, motivoErroIPTU: currentMotivos.filter((m) => m !== motivo) });
        } else {
            // Se não tem, adiciona
            onChange({ ...value, motivoErroIPTU: [...currentMotivos, motivo] });
        }
    }

    // Lógica para resetar o número do processo se ele mudar para "não"
    function handlePossuiProcessosChange(opcao: "sim" | "nao") {
        if (opcao === "nao") {
            onChange({ ...value, possuiProcessos: opcao, numerosProcessos: "" });
        } else {
            onChange({ ...value, possuiProcessos: opcao });
        }
    }

    const inputClasses = (hasError: boolean | undefined) => 
        `w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-pv-blue-900 transition ${hasError ? "border-red-500" : "border-gray-300"}`;

    return (
        <div className="mb-8 border border-gray-200 rounded-lg overflow-hidden shadow-lg">
            
            <div className="bg-gray-100 px-4 py-3 rounded-t-md border-b border-gray-200">
                <h5 className="text-sm md:text-base font-bold text-gray-800">
                    CAMPO IV - INFORMAÇÕES SOBRE A IMPUGNAÇÃO
                </h5>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Ano e Valores */}
                <div className="md:col-span-3">
                    <label className="block font-semibold mb-1 text-sm text-gray-700">
                        ANO DO IPTU: <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="anoIPTU"
                        value={value.anoIPTU}
                        onChange={(e) => handleChange("anoIPTU", e.target.value)}
                        placeholder="Ex: 2024"
                        className={inputClasses(!!errors.anoIPTU)}
                    />
                    {errors.anoIPTU && <p className="text-red-600 text-xs mt-1">{errors.anoIPTU}</p>}
                </div>
                <div className="md:col-span-4">
                    <label className="block font-semibold mb-1 text-sm text-gray-700">
                        VALOR COBRADO R$: <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="valorIPTUCobrado"
                        value={value.valorIPTUCobrado}
                        onChange={(e) => handleChange("valorIPTUCobrado", e.target.value)}
                        placeholder="Ex: 1.500,00"
                        className={inputClasses(!!errors.valorIPTUCobrado)}
                    />
                    {errors.valorIPTUCobrado && <p className="text-red-600 text-xs mt-1">{errors.valorIPTUCobrado}</p>}
                </div>
                <div className="md:col-span-5">
                    <label className="block font-semibold mb-1 text-sm text-gray-700">
                        VALOR CORRETO: <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center">
                        <span className="mr-2 font-bold text-gray-700">R$</span>
                        <input
                            type="text"
                            name="valorCorreto"
                            value={value.valorCorreto}
                            onChange={(e) => handleChange("valorCorreto", e.target.value)}
                            placeholder="Ex: 1.000,00"
                            className={inputClasses(!!errors.valorCorreto)}
                        />
                    </div>
                    {errors.valorCorreto && <p className="text-red-600 text-xs mt-1">{errors.valorCorreto}</p>}
                </div>

                {/* Botão Externo do DAM */}
                <div className="md:col-span-12 bg-blue-50 border border-blue-200 p-4 rounded-md flex flex-col sm:flex-row items-center justify-between">
                    <p className="text-sm font-semibold text-blue-900 mb-3 sm:mb-0">
                        CLIQUE AQUI E GERE O DAM (BOLETO) ONLINE NA OPÇÃO "TAXAS WEB"
                    </p>
                    <a 
                        href="https://gpi-trb.portovelho.ro.gov.br/ServerExec/acessoBase/?idPortal=dbde30ec-cf59-4803-9653-00121a704021" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition text-sm text-center"
                    >
                        Gerar DAM
                    </a>
                </div>

                {/* Processos Anteriores */}
                <div className="md:col-span-12 border-t border-gray-200 pt-4">
                    <label className="block font-semibold mb-2 text-sm text-gray-700">
                        POSSUI PROCESSOS ANTERIORES, INCLUSIVE DE ATUALIZAÇÃO CADASTRAL DE IMÓVEL?
                    </label>
                    <div className="flex items-center gap-6">
                        <label className="flex items-center cursor-pointer">
                            <input 
                                type="radio" 
                                name="possuiProcessos" 
                                checked={value.possuiProcessos === "nao"}
                                onChange={() => handlePossuiProcessosChange("nao")}
                                className="mr-2 h-4 w-4 text-pv-blue-900"
                            />
                            NÃO
                        </label>
                        <label className="flex items-center cursor-pointer">
                            <input 
                                type="radio" 
                                name="possuiProcessos" 
                                checked={value.possuiProcessos === "sim"}
                                onChange={() => handlePossuiProcessosChange("sim")}
                                className="mr-2 h-4 w-4 text-pv-blue-900"
                            />
                            SIM
                        </label>
                    </div>

                    {/* Campo condicional para os números dos processos */}
                    {value.possuiProcessos === "sim" && (
                        <div className="mt-3 w-full md:w-1/2 animate-fade-in">
                            <label className="block font-semibold mb-1 text-sm text-gray-700">
                                Nºs dos Processos: <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="numerosProcessos"
                                value={value.numerosProcessos}
                                onChange={(e) => handleChange("numerosProcessos", e.target.value)}
                                placeholder="Digite os números"
                                className={inputClasses(!!errors.numerosProcessos)}
                            />
                            {errors.numerosProcessos && <p className="text-red-600 text-xs mt-1">{errors.numerosProcessos}</p>}
                        </div>
                    )}
                </div>

                {/* Utilização do Imóvel */}
                <div className="md:col-span-12 border-t border-gray-200 pt-4">
                    <label className={`block font-semibold mb-2 text-sm ${errors.utilizacaoImovel ? "text-red-600" : "text-gray-700"}`}>
                        QUAL A UTILIZAÇÃO DO IMÓVEL: <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-wrap gap-4">
                        {["Residencial", "Não Residencial", "Misto", "Não Edificado", "Em Ruínas"].map((tipo) => (
                            <label key={tipo} className="flex items-center cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="utilizacaoImovel" 
                                    checked={value.utilizacaoImovel === tipo}
                                    onChange={() => handleChange("utilizacaoImovel", tipo)}
                                    className="mr-2 h-4 w-4 text-pv-blue-900"
                                />
                                {tipo.toUpperCase()}
                            </label>
                        ))}
                    </div>
                    {errors.utilizacaoImovel && <p className="text-red-600 text-xs mt-1">{errors.utilizacaoImovel}</p>}
                </div>

                {/* Motivos do Erro (Checkboxes) */}
                <div className="md:col-span-12 border-t border-gray-200 pt-4">
                    <label className={`block font-semibold mb-2 text-sm ${errors.motivoErroIPTU ? "text-red-600" : "text-gray-700"}`}>
                        O VALOR ESTÁ ERRADO POR MOTIVO(S) DE: <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-wrap gap-4">
                        {[
                            { id: "aliquota", label: "ALÍQUOTA" },
                            { id: "area", label: "ÁREA DO IMÓVEL" },
                            { id: "valor_venal", label: "VALOR VENAL" },
                            { id: "muro_calcada", label: "MURO/CALÇADA" },
                            { id: "outros", label: "OUTROS (Descreva abaixo)" }
                        ].map((motivo) => (
                            <label key={motivo.id} className="flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    name="motivoErroIPTU" 
                                    checked={value.motivoErroIPTU.includes(motivo.id)}
                                    onChange={() => handleCheckboxChange(motivo.id)}
                                    className="mr-2 h-4 w-4 text-pv-blue-900 rounded"
                                />
                                {motivo.label}
                            </label>
                        ))}
                    </div>
                    {/* Exibimos o erro do Zod para o array de motivos */}
                    {errors.motivoErroIPTU && <p className="text-red-600 text-xs mt-1">{errors.motivoErroIPTU}</p>}
                </div>

                {/* Motivação (Textarea) */}
                <div className="md:col-span-12 border-t border-gray-200 pt-4">
                    <label className="block font-semibold mb-1 text-sm text-gray-700">
                        DESCREVA A MOTIVAÇÃO FÁTICA E DE DIREITO DO PEDIDO E TODA A MATÉRIA QUE ENTENDER ÚTIL: <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="motivacaoPedido"
                        value={value.motivacaoPedido}
                        onChange={(e) => handleChange("motivacaoPedido", e.target.value)}
                        rows={6}
                        placeholder="Informe de forma clara os fatos, fundamentos jurídicos e as provas que possuir."
                        className={inputClasses(!!errors.motivacaoPedido)}
                    />
                    {errors.motivacaoPedido && <p className="text-red-600 text-xs mt-1">{errors.motivacaoPedido}</p>}
                </div>

            </div>
        </div>
    );
}