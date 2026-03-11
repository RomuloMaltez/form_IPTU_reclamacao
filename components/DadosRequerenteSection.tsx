"use client";

import React from "react";
import { FormErrors } from "../app/page";

export type DadosRequerente = {
    tipoRequerente: "proprioContribuinte" | "procurador" | "compromissario";
    nomeRequerente: string;
    cpfRequerente: string;
    enderecoRequerente: string;
    numeroRequerente: string;
    complementoRequerente: string;
    bairroRequerente: string;
    cepRequerente: string;
    cidadeUfRequerente: string;
    whatsappRequerente: string;
    emailRequerente: string;
};

type Props = {
    value: DadosRequerente;
    onChange: (value: DadosRequerente) => void;
    errors: FormErrors;
};

export default function DadosRequerenteSection({ value, onChange, errors }: Props) {

    // --- MÁSCARAS ---
    function formatCpf(v: string) {
        return v
            .replace(/\D/g, '') // Remove tudo o que não é dígito
            .replace(/(\d{3})(\d)/, '$1.$2') // Coloca um ponto entre o terceiro e o quarto dígitos
            .replace(/(\d{3})(\d)/, '$1.$2') // Coloca um ponto entre o sexto e o sétimo dígitos
            .replace(/(\d{3})(\d{1,2})/, '$1-$2') // Coloca um traço entre o nono e o décimo dígitos
            .replace(/(-\d{2})\d+?$/, '$1');
    }

    function formatCep(v: string) {
        return v.replace(/\D/g, "")
                .replace(/^(\d{5})(\d)/, "$1-$2")
                .slice(0, 9);
    }

    function formatTelefone(v: string) {
        return v.replace(/\D/g, "")
                .replace(/(\d{2})(\d)/, "($1) $2")
                .replace(/(\d{5})(\d)/, "$1-$2")
                .replace(/(-\d{4})\d+?$/, "$1");
    }

    // --- MANIPULADOR DE ESTADO ---
    function handleChange(field: keyof DadosRequerente, fieldValue: string) {
        let finalValue = fieldValue;

        if (field === "cpfRequerente") finalValue = formatCpf(fieldValue);
        else if (field === "cepRequerente") finalValue = formatCep(fieldValue);
        else if (field === "whatsappRequerente") finalValue = formatTelefone(fieldValue);

        onChange({ ...value, [field]: finalValue });
    }

    // Ao mudar o tipo de requerente, se voltar para "Próprio", limpamos os dados extras
    function handleTipoChange(tipo: "proprioContribuinte" | "procurador" | "compromissario") {
        if (tipo === "proprioContribuinte") {
            onChange({
                ...value,
                tipoRequerente: tipo,
                nomeRequerente: "", cpfRequerente: "", enderecoRequerente: "", numeroRequerente: "",
                complementoRequerente: "", bairroRequerente: "", cepRequerente: "", cidadeUfRequerente: "",
                whatsappRequerente: "", emailRequerente: ""
            });
        } else {
            onChange({ ...value, tipoRequerente: tipo });
        }
    }

    const inputClasses = (hasError: boolean | undefined) => 
        `w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-pv-blue-900 transition ${hasError ? "border-red-500" : "border-gray-300"}`;

    return (
        <div className="mb-8 border border-gray-200 rounded-lg overflow-hidden shadow-lg">
            
            <div className="bg-gray-100 px-4 py-3 rounded-t-md border-b border-gray-200">
                <h5 className="text-sm md:text-base font-bold text-gray-800">
                    CAMPO II - DADOS DO REQUERENTE
                </h5>
                <p className="text-xs text-gray-600 mt-1">
                    (Representante Legal, Procurador, Compromissário/Posseiro)
                </p>
            </div>

            <div className="p-4">
                {/* GRUPO DE RADIOS */}
                <div className={`flex flex-col gap-3 mb-4 p-3 rounded-md border ${errors.tipoRequerente ? "border-red-500 bg-red-50" : "border-transparent"}`}>
                    <label className="flex items-center cursor-pointer">
                        <input 
                            type="radio" 
                            name="tipoRequerente" 
                            checked={value.tipoRequerente === "proprioContribuinte"}
                            onChange={() => handleTipoChange("proprioContribuinte")}
                            className="mr-3 h-4 w-4 text-pv-blue-900"
                        />
                        <span className="text-gray-700 font-medium text-sm md:text-base">
                            O PRÓPRIO CONTRIBUINTE (Não é necessário preencher os dados repetidos)
                        </span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                        <input 
                            type="radio" 
                            name="tipoRequerente" 
                            checked={value.tipoRequerente === "procurador"}
                            onChange={() => handleTipoChange("procurador")}
                            className="mr-3 h-4 w-4 text-pv-blue-900"
                        />
                        <span className="text-gray-700 font-medium text-sm md:text-base">
                            PROCURADOR OU REPRESENTANTE LEGAL
                        </span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                        <input 
                            type="radio" 
                            name="tipoRequerente" 
                            checked={value.tipoRequerente === "compromissario"}
                            onChange={() => handleTipoChange("compromissario")}
                            className="mr-3 h-4 w-4 text-pv-blue-900"
                        />
                        <span className="text-gray-700 font-medium text-sm md:text-base">
                            COMPROMISSÁRIO/POSSEIRO (Comprou o imóvel mas não averbou)
                        </span>
                    </label>
                    {errors.tipoRequerente && <p className="text-red-600 text-sm mt-1">{errors.tipoRequerente}</p>}
                </div>

                {/* RENDERIZAÇÃO CONDICIONAL DOS CAMPOS EXTRAS */}
                {value.tipoRequerente !== "proprioContribuinte" && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 border-t border-gray-200 pt-6 animate-fade-in">
                        
                        {/* Nome Requerente */}
                        <div className="md:col-span-12">
                            <label className="block font-semibold mb-1 text-sm text-gray-700">
                                NOME COMPLETO (Por extenso sem abreviações): <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="nomeRequerente"
                                value={value.nomeRequerente}
                                onChange={(e) => handleChange("nomeRequerente", e.target.value)}
                                placeholder="Digite o nome completo do requerente"
                                className={inputClasses(!!errors.nomeRequerente)}
                            />
                            {errors.nomeRequerente && <p className="text-red-600 text-xs mt-1">{errors.nomeRequerente}</p>}
                        </div>

                        {/* CPF Requerente */}
                        <div className="md:col-span-6">
                            <label className="block font-semibold mb-1 text-sm text-gray-700">
                                CPF: <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="cpfRequerente"
                                value={value.cpfRequerente}
                                onChange={(e) => handleChange("cpfRequerente", e.target.value)}
                                placeholder="000.000.000-00"
                                className={inputClasses(!!errors.cpfRequerente)}
                            />
                            {errors.cpfRequerente && <p className="text-red-600 text-xs mt-1">{errors.cpfRequerente}</p>}
                        </div>

                        {/* Endereço Requerente */}
                        <div className="md:col-span-9">
                            <label className="block font-semibold mb-1 text-sm text-gray-700">
                                ENDEREÇO (RUA, AVENIDA): <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="enderecoRequerente"
                                value={value.enderecoRequerente}
                                onChange={(e) => handleChange("enderecoRequerente", e.target.value)}
                                placeholder="Rua, Avenida..."
                                className={inputClasses(!!errors.enderecoRequerente)}
                            />
                            {errors.enderecoRequerente && <p className="text-red-600 text-xs mt-1">{errors.enderecoRequerente}</p>}
                        </div>

                        {/* Número Requerente */}
                        <div className="md:col-span-3">
                            <label className="block font-semibold mb-1 text-sm text-gray-700">
                                Nº: <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="numeroRequerente"
                                value={value.numeroRequerente}
                                onChange={(e) => handleChange("numeroRequerente", e.target.value)}
                                placeholder="Número"
                                className={inputClasses(!!errors.numeroRequerente)}
                            />
                            {errors.numeroRequerente && <p className="text-red-600 text-xs mt-1">{errors.numeroRequerente}</p>}
                        </div>

                        {/* Complemento e Bairro Requerente */}
                        <div className="md:col-span-6">
                            <label className="block font-semibold mb-1 text-sm text-gray-700">
                                COMPLEMENTO:
                            </label>
                            <input
                                type="text"
                                name="complementoRequerente"
                                value={value.complementoRequerente}
                                onChange={(e) => handleChange("complementoRequerente", e.target.value)}
                                placeholder="Apto, Bloco, Casa..."
                                className={inputClasses(!!errors.complementoRequerente)}
                            />
                        </div>
                        <div className="md:col-span-6">
                            <label className="block font-semibold mb-1 text-sm text-gray-700">
                                BAIRRO: <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="bairroRequerente"
                                value={value.bairroRequerente}
                                onChange={(e) => handleChange("bairroRequerente", e.target.value)}
                                placeholder="Digite o bairro"
                                className={inputClasses(!!errors.bairroRequerente)}
                            />
                            {errors.bairroRequerente && <p className="text-red-600 text-xs mt-1">{errors.bairroRequerente}</p>}
                        </div>

                        {/* CEP, Cidade/UF Requerente */}
                        <div className="md:col-span-6">
                            <label className="block font-semibold mb-1 text-sm text-gray-700">
                                CEP: <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="cepRequerente"
                                value={value.cepRequerente}
                                onChange={(e) => handleChange("cepRequerente", e.target.value)}
                                placeholder="00000-000"
                                className={inputClasses(!!errors.cepRequerente)}
                            />
                            {errors.cepRequerente && <p className="text-red-600 text-xs mt-1">{errors.cepRequerente}</p>}
                        </div>
                        <div className="md:col-span-6">
                            <label className="block font-semibold mb-1 text-sm text-gray-700">
                                CIDADE / UF: <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="cidadeUfRequerente"
                                value={value.cidadeUfRequerente}
                                onChange={(e) => handleChange("cidadeUfRequerente", e.target.value)}
                                placeholder="Cidade/UF"
                                className={inputClasses(!!errors.cidadeUfRequerente)}
                            />
                            {errors.cidadeUfRequerente && <p className="text-red-600 text-xs mt-1">{errors.cidadeUfRequerente}</p>}
                        </div>

                        {/* Telefone/Whatsapp e Email Requerente */}
                        <div className="md:col-span-6">
                            <label className="block font-semibold mb-1 text-sm text-gray-700">
                                TELEFONE/WHATSAPP COM DDD: <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                name="whatsappRequerente"
                                value={value.whatsappRequerente}
                                onChange={(e) => handleChange("whatsappRequerente", e.target.value)}
                                placeholder="(00) 00000-0000"
                                className={inputClasses(!!errors.whatsappRequerente)}
                            />
                            {errors.whatsappRequerente && <p className="text-red-600 text-xs mt-1">{errors.whatsappRequerente}</p>}
                        </div>
                        <div className="md:col-span-6">
                            <label className="block font-semibold mb-1 text-sm text-gray-700">
                                E-MAIL: <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                name="emailRequerente"
                                value={value.emailRequerente}
                                onChange={(e) => handleChange("emailRequerente", e.target.value)}
                                placeholder="email@exemplo.com"
                                className={inputClasses(!!errors.emailRequerente)}
                            />
                            {errors.emailRequerente && <p className="text-red-600 text-xs mt-1">{errors.emailRequerente}</p>}
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}