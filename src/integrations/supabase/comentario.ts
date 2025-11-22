export interface Comentario {
  id: number;
  id_post: number;
  nome: string;
  email: string | null;
  mensagem: string;
  data: string;
}