
// 1. CADASTRO DE USUÁRIOS

// Captura o formulário de cadastro pelo ID no HTML
const formCadastro = document.getElementById('formCadastro')

if (formCadastro) {
    formCadastro.addEventListener('submit', (e) => {
        // Evita que a página seja recarregada ao enviar o formulário
        e.preventDefault()
        
        // Captura e limpa os espaços em branco dos inputs de cadastro
        const nome = document.getElementById('nome').value.trim()
        const email = document.getElementById('email').value.trim()
        const telefone = document.getElementById('telefone').value.trim()
        const senha = document.getElementById('senha').value
        
        const mensagem = document.getElementById('mensagem')
       
        // Validação básica dos campos inseridos pelo usuário
        if (nome.length < 4 || senha.length < 4 || !email.includes('@') || !email.includes('.') || telefone.length < 11) {
            mensagem.textContent = 'O usuário deve ter pelo menos 4 caracteres, senha 4 ou mais, o e-mail deve conter @ e . e o telefone tem que ter mais de 11 dígitos!'
            mensagem.classList.add('erro')
            return
        }

        const usuariosCadastrados = JSON.parse(localStorage.getItem('usuarios') || '[]')


        const emailExiste = usuariosCadastrados.find(usuario => usuario.email === email)

        if (emailExiste){
            mensagem.textContent = 'Email ja Registrado...'
            mensagem.classList.add('erro')
            return
        }

        
        usuariosCadastrados.push({nome,email,telefone,senha})
        // Salva os dados do usuário no localStorage em formato JSON
        localStorage.setItem('usuarios', JSON.stringify(usuariosCadastrados))

        mensagem.textContent = 'Cadastro realizado! Agora você pode fazer login.'
        mensagem.classList.add('sucesso')
        
        // Limpa o formulário após o cadastro bem-sucedido
        formCadastro.reset()

        // Redireciona para a página de login (index.html) após 1.5 segundos
        setTimeout(() => {
            window.location.href = 'index.html'
        }, 1500)
    })
}



// 2. AUTENTICAÇÃO E LOGIN
const formLogin = document.getElementById('formLogin')

if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
        e.preventDefault()

        const emailInput = document.getElementById('loginEmail') || document.getElementById('email');
        const senhaInput = document.getElementById('loginSenha') || document.getElementById('senha');
        const mensagem = document.getElementById('mensagem');

        if (!emailInput || !senhaInput) {
            console.error("Inputs de e-mail ou senha não foram encontrados no HTML.");
            return;
        }

        const emailDigitado = emailInput.value.trim()
        const senhaDigitada = senhaInput.value

        // Pega a lista completa de usuários persistidos
        const usuariosCadastrados = JSON.parse(localStorage.getItem('usuarios') || '[]')

        mensagem.className = 'mensagem' 

        // Procura na lista se existe um usuário com o mesmo e-mail E senha correspondentes
        const usuarioValido = usuariosCadastrados.find(u => u.email === emailDigitado && u.senha === senhaDigitada)

        if (usuarioValido) { 
            sessionStorage.setItem('autenticado', 'true')
            sessionStorage.setItem('usuarioLogado', usuarioValido.email)
            mensagem.textContent = `Login realizado com sucesso! Bem vindo ${usuarioValido.nome}`
            mensagem.classList.add('sucesso')
            setTimeout(() => {
                window.location.href = 'cliente.html'
            }, 1500)
            
        } else {
            mensagem.textContent = 'E-mail ou senha inválidos. Confira os dados e tente novamente.'
            mensagem.classList.add('erro')
        }
    })
}



// 3. CONTROLE DE ACESSO E SESSÃO (PROTEÇÃO DE ROTAS)

const pathAtual = window.location.pathname;
// Define quais páginas exigem que o usuário esteja logado para acessar
const paginaPrivada = pathAtual.endsWith('cliente.html') || pathAtual.endsWith('agendamentos.html');
const estaAutenticado = sessionStorage.getItem('autenticado') === 'true';
const emailLogado = sessionStorage.getItem('usuarioLogado');

// Se a página for restrita e o usuário não estiver autenticado, expulsa para a tela de login
if (paginaPrivada && !estaAutenticado) {
    window.location.replace('index.html');
}

// Exibe dinamicamente o nome do cliente logado no título de boas-vindas da página
document.addEventListener('DOMContentLoaded', () => {
    const tituloBoasVindas = document.querySelector('.boas-vindas h1');
    if (tituloBoasVindas && emailLogado) {
        const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
        const usuarioDados = usuarios.find(u => u.email === emailLogado);
        if (usuarioDados) {
            tituloBoasVindas.textContent = `Olá, ${usuarioDados.nome}!`;
        }
    }
});

// Botão de Sair (Logout): limpa a sessão e retorna à tela inicial/login
const botaoSair = document.getElementById('sair');

if (botaoSair) {
    botaoSair.addEventListener('click', (e) => {
        e.preventDefault();
        sessionStorage.removeItem('autenticado');
        sessionStorage.removeItem('usuarioLogado');
        window.location.replace('index.html');
    });
}



// 4. CADASTRO E GERENCIAMENTO DE PETS

// Escapa caracteres especiais para que texto digitado nunca seja interpretado como HTML
function escapar(texto) {
    return String(texto).replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
}

const formCadPet = document.querySelector('.auth-form form') || document.querySelector('form');
const listaPetsContainer = document.getElementById('listaPets') || document.querySelector('.grade .painel:last-child');

// Função auxiliar para recuperar todos os pets salvos no localStorage
function obterTodosPets() {
    return JSON.parse(localStorage.getItem('pets') || '[]');
}

// Renderiza a lista de pets na tela, filtrando apenas os pertencentes ao usuário logado
function mostrarPets() {
    if (!listaPetsContainer) return;

    let listaUL = listaPetsContainer.querySelector('.lista');
    if (!listaUL) {
        listaUL = document.createElement('ul');
        listaUL.className = 'lista';
        listaPetsContainer.appendChild(listaUL);
    }
    listaUL.innerHTML = '';

    const todosPets = obterTodosPets();
    // Filtra os pets associados ao e-mail do usuário logado atualmente
    const meusPets = todosPets.filter(pet => pet.proprietarioId === emailLogado);

    if (meusPets.length === 0) {
        listaUL.innerHTML = '<p class="estado-vazio">Você ainda não cadastrou nenhum pet. Use o formulário ao lado para começar.</p>';
        return;
    }

    meusPets.forEach((pet) => {
        const itemLI = document.createElement('li');
        itemLI.className = 'item';
        //Cria o card onde mostra os pets
        itemLI.innerHTML = `
            <div class="item-principal">
                <div>
                    <span class="item-titulo">${escapar(pet.nome)}</span>
                    <p class="item-detalhe">${escapar(pet.raca)} &bull; ${escapar(pet.idade)} anos</p>
                </div>
                <span class="selo">${escapar(pet.especie)}</span>
                <button type="button" class="botao botao-destaque" style="width:auto; padding: 0.3rem 0.7rem; font-size:0.85rem;">Excluir</button>
            </div>
        `;

        // Evento de exclusão de um pet específico baseado no seu ID único
        itemLI.querySelector('button').addEventListener('click', () => {
            const atualizados = obterTodosPets().filter(p => p.id !== pet.id);
            localStorage.setItem('pets', JSON.stringify(atualizados));
            mostrarPets(); // Atualiza a lista exibida na tela
        });

        listaUL.appendChild(itemLI);
    });
}

// Ativa o fluxo de cadastro e listagem de pets se estiver na página cliente.html
if (pathAtual.endsWith('cliente.html') && formCadPet) {
    mostrarPets();

    formCadPet.addEventListener('submit', (e) => {
        if (e.target.id === 'formAgendamento') return; // Evita conflitos com formulários de agendamento
        e.preventDefault();

        const especie = formCadPet.querySelector('select').value;
        const raca = formCadPet.querySelector('input[placeholder="Raça"]')?.value.trim() || formCadPet.querySelectorAll('input')[0].value.trim();
        const nome = formCadPet.querySelector('input[placeholder="Nome do pet"]')?.value.trim() || formCadPet.querySelectorAll('input')[1].value.trim();
        const idadeInput = formCadPet.querySelector('input[type="number"]') || formCadPet.querySelectorAll('input')[2];
        const idade = parseInt(idadeInput.value);

        if (!especie || !raca || !nome || isNaN(idade)) {
            alert('Por favor, preencha todos os campos do pet.');
            return;
        }

        if (idade < 0) {
            alert('A idade do pet não pode ser negativa!');
            return;
        }

        const todosPets = obterTodosPets();
        const novoPet = {
            id: 'pet_' + Date.now(),          // Cria um ID único temporal
            proprietarioId: emailLogado,      // Vincula o pet ao dono logado
            especie,
            raca,
            nome,
            idade
        };

        todosPets.push(novoPet);
        localStorage.setItem('pets', JSON.stringify(todosPets));

        formCadPet.reset();
        mostrarPets();
    });
}



// 5. SISTEMA DE AGENDAMENTOS


const formAgendamento = document.getElementById('formAgendamento');
const listaAgendamentosContainer = document.getElementById('listaAgendamentos') || document.querySelector('.conteudo .painel:last-child');

// Preenche dinamicamente o elemento <select> com os pets pertencentes ao usuário logado
function popularSelectPets() {
    const selectPet = document.getElementById('pet') || document.querySelector('#formAgendamento select');
    if (!selectPet) return;

    selectPet.innerHTML = '<option value="">Selecione um pet</option>';
    const meusPets = obterTodosPets().filter(pet => pet.proprietarioId === emailLogado);

    meusPets.forEach(pet => {
        const opt = document.createElement('option');
        opt.value = pet.id;
        opt.textContent = pet.nome;
        selectPet.appendChild(opt);
    });
}

// Resgata todos os agendamentos salvos no localStorage
function obterTodosAgendamentos() {
    return JSON.parse(localStorage.getItem('agendamentos') || '[]');
}

// Renderiza a lista de agendamentos na tela para o usuário logado
function mostrarAgendamentos() {
    if (!listaAgendamentosContainer) return;

    let listaUL = listaAgendamentosContainer.querySelector('.lista');
    if (!listaUL) {
        listaUL = document.createElement('ul');
        listaUL.className = 'lista';
        listaAgendamentosContainer.appendChild(listaUL);
    }
    listaUL.innerHTML = '';

    const todosAgendamentos = obterTodosAgendamentos();
    const meusAgendamentos = todosAgendamentos.filter(ag => ag.proprietarioId === emailLogado);
    const todosPets = obterTodosPets();

    if (meusAgendamentos.length === 0) {
        listaUL.innerHTML = '<p class="estado-vazio">Nenhum agendamento por enquanto. Preencha o formulário para marcar o primeiro.</p>';
        return;
    }

    meusAgendamentos.forEach((agendamento) => {
        // Encontra o nome do pet relacionado ao agendamento pelo ID do pet
        const petAssociado = todosPets.find(p => p.id === agendamento.petId);
        const nomePet = petAssociado ? petAssociado.nome : 'Pet não encontrado';
        // Formata a data de AAAA-MM-DD para DD/MM/AAAA
        const dataFormatada = agendamento.data.split('-').reverse().join('/');

        const itemLI = document.createElement('li');
        itemLI.className = 'item';

        itemLI.innerHTML = `
            <div class="item-principal">
                <div>
                    <span class="item-titulo">${escapar(agendamento.servico)} - ${escapar(nomePet)}</span>
                    <p class="item-detalhe">📅 Data: ${escapar(dataFormatada)} às ${escapar(agendamento.horario)}h</p>
                </div>
                <button type="button" class="botao" style="width:auto; background:#b3372f; border-color:#b3372f; padding: 0.3rem 0.7rem; font-size:0.85rem;">Cancelar</button>
            </div>
        `;

        // Funcionalidade para cancelar/remover um agendamento específico
        itemLI.querySelector('button').addEventListener('click', () => {
            const atualizados = obterTodosAgendamentos().filter(a => a.id !== agendamento.id);
            localStorage.setItem('agendamentos', JSON.stringify(atualizados));
            mostrarAgendamentos();
        });

        listaUL.appendChild(itemLI);
    });
}

// Ativa as funções de agendamento caso esteja na página agendamentos.html
if (pathAtual.endsWith('agendamentos.html')) {
    popularSelectPets();
    mostrarAgendamentos();

    if (formAgendamento) {
        formAgendamento.addEventListener('submit', (e) => {
            e.preventDefault();

            const petId = document.getElementById('pet')?.value || formAgendamento.querySelectorAll('select')[0].value;
            const servico = document.getElementById('servico')?.value || formAgendamento.querySelectorAll('select')[1].value;
            const data = formAgendamento.querySelector('input[type="date"]')?.value || document.getElementById('data')?.value;
            const horario = formAgendamento.querySelector('input[type="time"]')?.value || document.getElementById('horario')?.value;

            if (!petId || !servico || !data || !horario) {
                alert('Por favor, preencha todos os campos do agendamento.');
                return;
            }

            const todosAgendamentos = obterTodosAgendamentos();
            const novoAgendamento = {
                id: 'agend_' + Date.now(),     // ID único temporal
                proprietarioId: emailLogado,   // Dono que fez o agendamento
                petId,                         // Pet selecionado para o serviço
                servico,
                data,
                horario
            };

            todosAgendamentos.push(novoAgendamento);

            localStorage.setItem('agendamentos', JSON.stringify(todosAgendamentos));
            formAgendamento.reset();
            mostrarAgendamentos();
        });
    }
}


// 6. TEMA CLARO/ESCURO
// O visual é controlado pelo CSS (checkbox #alternarTema); aqui só guardamos a escolha.

const checkboxTema = document.getElementById('alternarTema');

if (checkboxTema) {
    checkboxTema.checked = localStorage.getItem('tema') === 'escuro';

    checkboxTema.addEventListener('change', () => {
        localStorage.setItem('tema', checkboxTema.checked ? 'escuro' : 'claro');
    });
}
