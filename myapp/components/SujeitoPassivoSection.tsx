"use client";

import React from "react";
import { FormErrors } from "../app/page"; // Ajuste o caminho conforme necessário

export type DadosSujeitoPassivo = {
    nome: string;
    cpfCnpj: string;
    documentoIdentidade: string;
    endereco: string;
    numero: string;
    complemento: string;
    bairro: string;
    cep: string;
    cidadeUf: string;
    whatsapp: string;
    email: string;
    telefone: string;
};

type Props = {
    value: DadosSujeitoPassivo;
    onChange: (value: DadosSujeitoPassivo) => void;
    errors: FormErrors;
};

export default function SujeitoPassivoSection({ value, onChange, errors }: Props) {

    // --- MÁSCARAS ---
    function formatCpfCnpj(v: string) {
        v = v.replace(/\D/g, "");
        if (v.length <= 11) { // CPF
            return v.replace(/(\d{3})(\d)/, "$1.$2")
                    .replace(/(\d{3})(\d)/, "$1.$2")
                    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        } else { // CNPJ
            return v.replace(/^(\d{2})(\d)/, "$1.$2")
                    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
                    .replace(/\.(\d{3})(\d)/, ".$1/$2")
                    .replace(/(\d{4})(\d)/, "$1-$2")
                    .slice(0, 18);
        }
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
    function handleChange(field: keyof DadosSujeitoPassivo, fieldValue: string) {
        let finalValue = fieldValue;

        if (field === "cpfCnpj") finalValue = formatCpfCnpj(fieldValue);
        else if (field === "cep") finalValue = formatCep(fieldValue);
        else if (field === "whatsapp" || field === "telefone") finalValue = formatTelefone(fieldValue);

        onChange({ ...value, [field]: finalValue });
    }

    // Helper para classes CSS
    const inputClasses = (hasError: boolean | undefined) => 
        `w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-pv-blue-900 transition ${hasError ? "border-red-500" : "border-gray-300"}`;

    return (
        <div className="mb-8 border border-gray-200 rounded-lg overflow-hidden shadow-lg">
            
            <div className="bg-gray-100 px-4 py-3 rounded-t-md border-b border-gray-200">
                <h5 className="text-sm md:text-base font-bold text-gray-800">
                    CAMPO I - DADOS DO SUJEITO PASSIVO
                </h5>
                <p className="text-xs text-gray-600 mt-1">
                    (nome da pessoa que consta como proprietário do imóvel na Certidão de Inteiro Teor)
                </p>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4">
                
                {/* Nome / Razão Social */}
                <div className="md:col-span-12">
                    <label className="block font-semibold mb-1 text-sm text-gray-700">
                        NOME / RAZÃO SOCIAL (Por extenso sem abreviações): <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="nome"
                        value={value.nome}
                        onChange={(e) => handleChange("nome", e.target.value)}
                        placeholder="Digite o nome completo ou razão social"
                        className={inputClasses(!!errors.nome)}
                    />
                    {errors.nome && <p className="text-red-600 text-xs mt-1">{errors.nome}</p>}
                </div>

                {/* CPF / CNPJ */}
                <div className="md:col-span-6">
                    <label className="block font-semibold mb-1 text-sm text-gray-700">
                        CPF / CNPJ: <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="cpfCnpj"
                        value={value.cpfCnpj}
                        onChange={(e) => handleChange("cpfCnpj", e.target.value)}
                        placeholder="000.000.000-00 ou 00.000.000/0000-00"
                        className={inputClasses(!!errors.cpfCnpj)}
                    />
                    {errors.cpfCnpj && <p className="text-red-600 text-xs mt-1">{errors.cpfCnpj}</p>}
                </div>

                {/* Documento de Identidade */}
                <div className="md:col-span-6">
                    <label className="block font-semibold mb-1 text-sm text-gray-700">
                        DOCUMENTO DE IDENTIDADE: <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="documentoIdentidade"
                        value={value.documentoIdentidade}
                        onChange={(e) => handleChange("documentoIdentidade", e.target.value)}
                        placeholder="Número do documento"
                        className={inputClasses(!!errors.documentoIdentidade)}
                    />
                    {errors.documentoIdentidade && <p className="text-red-600 text-xs mt-1">{errors.documentoIdentidade}</p>}
                </div>

                {/* Endereço e Número */}
                <div className="md:col-span-9">
                    <label className="block font-semibold mb-1 text-sm text-gray-700">
                        ENDEREÇO (RUA, AVENIDA): <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="endereco"
                        value={value.endereco}
                        onChange={(e) => handleChange("endereco", e.target.value)}
                        placeholder="Rua, Avenida..."
                        className={inputClasses(!!errors.endereco)}
                    />
                    {errors.endereco && <p className="text-red-600 text-xs mt-1">{errors.endereco}</p>}
                </div>
                <div className="md:col-span-3">
                    <label className="block font-semibold mb-1 text-sm text-gray-700">
                        Nº: <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="numero"
                        value={value.numero}
                        onChange={(e) => handleChange("numero", e.target.value)}
                        placeholder="Número"
                        className={inputClasses(!!errors.numero)}
                    />
                    {errors.numero && <p className="text-red-600 text-xs mt-1">{errors.numero}</p>}
                </div>

                {/* Complemento e Bairro */}
                <div className="md:col-span-6">
                    <label className="block font-semibold mb-1 text-sm text-gray-700">
                        COMPLEMENTO:
                    </label>
                    <input
                        type="text"
                        name="complemento"
                        value={value.complemento}
                        onChange={(e) => handleChange("complemento", e.target.value)}
                        placeholder="Apto, Bloco, Casa..."
                        className={inputClasses(!!errors.complemento)}
                    />
                </div>
                <div className="md:col-span-6">
                    <label className="block font-semibold mb-1 text-sm text-gray-700">
                        BAIRRO: <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="bairro"
                        value={value.bairro}
                        onChange={(e) => handleChange("bairro", e.target.value)}
                        placeholder="Digite o bairro"
                        className={inputClasses(!!errors.bairro)}
                    />
                    {errors.bairro && <p className="text-red-600 text-xs mt-1">{errors.bairro}</p>}
                </div>

                {/* CEP, Cidade/UF e WhatsApp */}
                <div className="md:col-span-4">
                    <label className="block font-semibold mb-1 text-sm text-gray-700">
                        CEP: <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="cep"
                        value={value.cep}
                        onChange={(e) => handleChange("cep", e.target.value)}
                        placeholder="00000-000"
                        className={inputClasses(!!errors.cep)}
                    />
                    {errors.cep && <p className="text-red-600 text-xs mt-1">{errors.cep}</p>}
                </div>
                <div className="md:col-span-4">
                    <label className="block font-semibold mb-1 text-sm text-gray-700">
                        CIDADE / UF: <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="cidadeUf"
                        value={value.cidadeUf}
                        onChange={(e) => handleChange("cidadeUf", e.target.value)}
                        placeholder="Ex: Porto Velho/RO"
                        className={inputClasses(!!errors.cidadeUf)}
                    />
                    {errors.cidadeUf && <p className="text-red-600 text-xs mt-1">{errors.cidadeUf}</p>}
                </div>
                <div className="md:col-span-4">
                    <label className="block font-semibold mb-1 text-sm text-gray-700">
                        WHATSAPP COM DDD: <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="tel"
                        name="whatsapp"
                        value={value.whatsapp}
                        onChange={(e) => handleChange("whatsapp", e.target.value)}
                        placeholder="(00) 00000-0000"
                        className={inputClasses(!!errors.whatsapp)}
                    />
                    {errors.whatsapp && <p className="text-red-600 text-xs mt-1">{errors.whatsapp}</p>}
                </div>

                {/* Email e Telefone (Fixo/Outro) */}
                <div className="md:col-span-6">
                    <label className="block font-semibold mb-1 text-sm text-gray-700">
                        E-MAIL: <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={value.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="email@exemplo.com"
                        className={inputClasses(!!errors.email)}
                    />
                    {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
                </div>
                <div className="md:col-span-6">
                    <label className="block font-semibold mb-1 text-sm text-gray-700">
                        TELEFONE COM DDD:
                    </label>
                    <input
                        type="tel"
                        name="telefone"
                        value={value.telefone}
                        onChange={(e) => handleChange("telefone", e.target.value)}
                        placeholder="(00) 0000-0000"
                        className={inputClasses(!!errors.telefone)}
                    />
                    {/* Telefone não era obrigatório no seu HTML original */}
                </div>

            </div>
        </div>
    );
}