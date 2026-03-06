"use client";

import React from "react";
import { FormErrors } from "../app/page";

export type DadosImovel = {
    inscricaoImobiliaria: string;
    enderecoImovel: string;
    numeroImovel: string;
    complementoImovel: string;
    bairroImovel: string;
    cepImovel: string;
    cidadeUfImovel: string;
    distritoImovel: string;
};

type Props = {
    value: DadosImovel;
    onChange: (value: DadosImovel) => void;
    errors: FormErrors;
};

export default function DadosImovelSection({ value, onChange, errors }: Props) {

    // --- MÁSCARAS ---
    // Inscrição Imobiliária geralmente só aceita números, mas o formato pode variar. 
    // Vamos apenas remover caracteres não-numéricos para manter o padrão do seu HTML original.
    function formatInscricao(v: string) {
        return v.replace(/\D/g, "");
    }

    function formatCep(v: string) {
        return v.replace(/\D/g, "")
                .replace(/^(\d{5})(\d)/, "$1-$2")
                .slice(0, 9);
    }

    // --- MANIPULADOR DE ESTADO ---
    function handleChange(field: keyof DadosImovel, fieldValue: string) {
        let finalValue = fieldValue;

        if (field === "inscricaoImobiliaria") finalValue = formatInscricao(fieldValue);
        else if (field === "cepImovel") finalValue = formatCep(fieldValue);
        
        onChange({ ...value, [field]: finalValue });
    }

    const inputClasses = (hasError: boolean | undefined) => 
        `w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-pv-blue-900 transition ${hasError ? "border-red-500" : "border-gray-300"}`;

    return (
        <div className="mb-8 border border-gray-200 rounded-lg overflow-hidden shadow-lg">
            
            <div className="bg-gray-100 px-4 py-3 rounded-t-md border-b border-gray-200">
                <h5 className="text-sm md:text-base font-bold text-gray-800">
                    CAMPO III - DADOS DO IMÓVEL OBJETO DO PEDIDO
                </h5>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4">
                
                {/* Inscrição Imobiliária (Com aviso de destaque) */}
                <div className="md:col-span-12">
                    <label className="block font-semibold mb-1 text-sm text-gray-700">
                        INSCRIÇÃO IMOBILIÁRIA. <span className="text-red-400 font-bold uppercase ml-1">(Atenção: Somente uma inscrição por requerimento!)</span> <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="inscricaoImobiliaria"
                        value={value.inscricaoImobiliaria}
                        onChange={(e) => handleChange("inscricaoImobiliaria", e.target.value)}
                        placeholder="Somente números"
                        className={inputClasses(!!errors.inscricaoImobiliaria)}
                    />
                    {errors.inscricaoImobiliaria && <p className="text-red-600 text-xs mt-1">{errors.inscricaoImobiliaria}</p>}
                </div>

                {/* Endereço Imóvel */}
                <div className="md:col-span-9">
                    <label className="block font-semibold mb-1 text-sm text-gray-700">
                        ENDEREÇO (RUA, AVENIDA): <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="enderecoImovel"
                        value={value.enderecoImovel}
                        onChange={(e) => handleChange("enderecoImovel", e.target.value)}
                        placeholder="Rua, Avenida do imóvel"
                        className={inputClasses(!!errors.enderecoImovel)}
                    />
                    {errors.enderecoImovel && <p className="text-red-600 text-xs mt-1">{errors.enderecoImovel}</p>}
                </div>

                {/* Número Imóvel */}
                <div className="md:col-span-3">
                    <label className="block font-semibold mb-1 text-sm text-gray-700">
                        Nº: <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="numeroImovel"
                        value={value.numeroImovel}
                        onChange={(e) => handleChange("numeroImovel", e.target.value)}
                        placeholder="Número"
                        className={inputClasses(!!errors.numeroImovel)}
                    />
                    {errors.numeroImovel && <p className="text-red-600 text-xs mt-1">{errors.numeroImovel}</p>}
                </div>

                {/* Complemento Imóvel */}
                <div className="md:col-span-6">
                    <label className="block font-semibold mb-1 text-sm text-gray-700">
                        COMPLEMENTO:
                    </label>
                    <input
                        type="text"
                        name="complementoImovel"
                        value={value.complementoImovel}
                        onChange={(e) => handleChange("complementoImovel", e.target.value)}
                        placeholder="Apto, Bloco, Casa, Condomínio..."
                        className={inputClasses(!!errors.complementoImovel)}
                    />
                </div>

                {/* Bairro Imóvel */}
                <div className="md:col-span-6">
                    <label className="block font-semibold mb-1 text-sm text-gray-700">
                        BAIRRO: <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="bairroImovel"
                        value={value.bairroImovel}
                        onChange={(e) => handleChange("bairroImovel", e.target.value)}
                        placeholder="Bairro do imóvel"
                        className={inputClasses(!!errors.bairroImovel)}
                    />
                    {errors.bairroImovel && <p className="text-red-600 text-xs mt-1">{errors.bairroImovel}</p>}
                </div>

                {/* CEP Imóvel */}
                <div className="md:col-span-4">
                    <label className="block font-semibold mb-1 text-sm text-gray-700">
                        CEP: <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="cepImovel"
                        value={value.cepImovel}
                        onChange={(e) => handleChange("cepImovel", e.target.value)}
                        placeholder="00000-000"
                        className={inputClasses(!!errors.cepImovel)}
                    />
                    {errors.cepImovel && <p className="text-red-600 text-xs mt-1">{errors.cepImovel}</p>}
                </div>

                {/* Cidade/UF Imóvel (Readonly, conforme original) */}
                <div className="md:col-span-4">
                    <label className="block font-semibold mb-1 text-sm text-gray-700">
                        CIDADE / UF:
                    </label>
                    <input
                        type="text"
                        name="cidadeUfImovel"
                        value={value.cidadeUfImovel}
                        readOnly // Bloqueia edição
                        className="w-full p-2 border border-gray-300 rounded-md bg-gray-200 text-gray-600 cursor-not-allowed focus:outline-none"
                    />
                </div>

                {/* Distrito Imóvel (Opcional) */}
                <div className="md:col-span-4">
                    <label className="block font-semibold mb-1 text-sm text-gray-700">
                        DISTRITO <span className="text-red-400 font-bold ml-1">(Não preencher se for PVH)</span>:
                    </label>
                    <input
                        type="text"
                        name="distritoImovel"
                        value={value.distritoImovel}
                        onChange={(e) => handleChange("distritoImovel", e.target.value)}
                        placeholder="Nome do distrito"
                        className={inputClasses(!!errors.distritoImovel)}
                    />
                </div>

            </div>
        </div>
    );
}