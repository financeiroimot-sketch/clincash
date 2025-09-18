export interface Empresa {
  id: string;
  cnpj?: string;
  razaoSocial?: string;
}

export interface Coluna {
  coluna: string;
  ativo: boolean;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  senha: string;
  ativo: boolean;
  dataCadastro: string;
  usuarioResponsavel: string;
  permissaoLivroCaixa: boolean;
  colunasContasPagar: Coluna[];
  colunasContasReceber: Coluna[];
  colunasLivroCaixa: Coluna[];
  telefone?: string;
}

export interface ContaSimples {
  valor: number;
  valorPagamento: number;
}

export interface PlanoConta {
  id: string;
  descricao: string;
  natureza: string;
  tipoConta: "receita" | "despesa";
  ativo?: boolean;
  referencialId?: string;
  classificacao: string;
  dataCadastro?: string;
  nivel?: number;
  usuarioResponsavel?: string;
  contasPlano?: ContaSimples[];
}

export interface Pessoa {
  id: string;
  razaoSocial: string;
  documento?: string;
  email?: string;
  telefone?: string;
  cep?: string;
  endereco?: string;
  numero?: string;
  bairro?: string;
  complemento?: string;
  estado?: string;
  cidade?: string;
  planoContasId?: string;
  planoContasDescricao?: string;
  isFornecedor?: boolean;
  isCliente?: boolean;
}

export interface Conta {
  id: string;
  razaoSocial: string;
  razaoSocialDescricao: string;
  tipoConta: TipoConta;
  statusPagamento: StatusPagamento;
  statusVencimento: StatusVencimento;
  statusVencimentoCor: string;
  isNew?: boolean;
  planoContasId?: string;
  planoContasDescricao?: string;
  dataVencimento?: string;
  dataCadastro?: string;
  dataPagamento?: string;
  usuarioResponsavel?: string;
  valor: number;
  valorPagamento?: number;
  comprovante?: string;
  nomeComprovante?: string;
  ativo?: boolean;
  editing?: boolean;
}

export interface Option {
  value: string;
  label: string;
}

export interface ValorPorPessoa {
  pessoa: string;
  total: number;
}

export interface ContasFilter {
  statusVencimento?: StatusVencimento;
  statusPagamento?: StatusPagamento;
  razaoSocialDescricao?: string[];
  planoContasDescricao?: string[];
  dataVencimentoInicial?: string;
  dataVencimentoFinal?: string;
  dataPagamentoInicial?: string;
  dataPagamentoFinal?: string;
}

export type TipoConta = "contasPagar" | "contasReceber";

export type StatusPagamento = "pago" | "emAberto";

export type StatusVencimento = "Vence Hoje" | "Vencido" | "Vence Essa Semana" | "A Vencer";

export type CollectionName =
  "contasPagar"
  | "contasReceber"
  | "empresas"
  | "pessoas"
  | "planosContas"
  | "usuarios"
  | "atividades"
  | "livroCaixa";
