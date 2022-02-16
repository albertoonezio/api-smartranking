import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { uuid } from 'uuid';

@Injectable()
export class JogadoresService {
  private jogadores: Jogador[] = [];
  private readonly logger = new Logger(JogadoresService.name);

  async criarAtualizarJogador(criarJogadorDto: CriarJogadorDto): Promise<void> {
    const { email } = criarJogadorDto;

    const jogadorEncontrado = this.encontrarJogador(email);

    if (jogadorEncontrado) {
      this.atualizar(jogadorEncontrado, criarJogadorDto);
    } else {
      this.criar(criarJogadorDto);
    }
  }

  async consultarTodosJogadores(): Promise<Jogador[]> {
    return await this.jogadores;
  }

  async consultarJogadorPeloEmail(email: string): Promise<Jogador> {
    const jogadorEncontrado = this.encontrarJogador(email);

    if (!jogadorEncontrado) {
      throw new NotFoundException(`Jogador com e-mail ${email} não encontrado`);
    }

    return jogadorEncontrado;
  }

  async deletatJogador(email): Promise<void> {
    const jogadorEncontrado = this.encontrarJogador(email);

    this.jogadores = this.jogadores.filter(
      (jogador) => jogador.email !== jogadorEncontrado.email,
    );
  }

  private criar(criarJogadorDto: CriarJogadorDto): void {
    const { nome, telefoneCelular, email } = criarJogadorDto;

    const jogador: Jogador = {
      _id: uuid(),
      nome: nome,
      telefoneCelular: telefoneCelular,
      email: email,
      ranking: 'A',
      posicaoRanking: 1,
      urlFotoJogador: 'www.google.com.br/foto123.jpg',
    };
    this.logger.log(`criarJogadorDto: ${jogador}`);
    this.jogadores.push(jogador);
  }

  private atualizar(
    jogadorEncontrado: Jogador,
    criarJogadorDto: CriarJogadorDto,
  ): void {
    const { nome } = criarJogadorDto;

    jogadorEncontrado.nome = nome;
  }

  private encontrarJogador(email: string): Jogador {
    const jogadorEncontrado = await this.jogadores.find(
      (jogador) => jogador.email === email,
    );

    return jogadorEncontrado;
  }
}
