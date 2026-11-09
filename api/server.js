// ======================================================
// 1. Importação das dependências
// ======================================================
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');

// ======================================================
// 2. Configuração do servidor
// ======================================================
const app = express();
const PORT = process.env.PORT || 3300;

app.use(cors());
app.use(express.json());

// ======================================================
// 3. Banco de dados simulado (memória)
// Os dados são perdidos quando o servidor é reiniciado.
// ======================================================
const users = [];
const pet = []
const agendamento = []

// Contadores para gerar IDs numéricos automaticamente.
let nextUserId = 1;
let nextPets = 1;
let nextAgendamento = 1

// ======================================================
// 4. ROTAS DE USUÁRIOS
// ======================================================

// Cadastrar usuário
app.post('/users', (req, res) => {
    const { name, email,password } = req.body;

    // Validar os dados recebidos
    if (
        typeof name !== 'string' || !name.trim() ||
        typeof password !== 'string' || !password ||
        typeof email !== 'string' || !email.trim()
    ) {
        return res.status(400).json({
            message: 'Nome, e-mail e senha são obrigatórios.'
        });
    }

    // Criar objeto do usuário com ID automático
    const emailNormalizado = email.trim().toLowerCase();

    const emailOld = users.find(u => u.email === emailNormalizado)
    if(emailOld){
        return res.status(400).json({
            message:'Email ja cadastrado!'
        })
    }

    const user = {
        id: nextUserId++,
        name: name.trim(),
        email: emailNormalizado,
        passwordHash: bcrypt.hashSync(password, 10)
    };

    // Armazenar usuário no array
    users.push(user);

    // Retornar resposta sem expor a senha
    return res.status(201).json({
        message: 'Usuário cadastrado com sucesso!',
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    });
});

// Listar usuários
app.get('/users', (req, res) => {
    // Retornar somente ID e nome
    const safeUsers = users.map(({ id, name,email }) => ({
        id,
        name,
        email
    }));

    return res.status(200).json(safeUsers);
});

// Consultar usuário por ID
app.get('/users/:id', (req, res) => {
    const id = Number(req.params.id);

    // Validar ID
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: 'Informe um ID válido.'
        });
    }

    // Buscar usuário pelo ID
    const user = users.find(user => user.id === id);

    // Verificar se o usuário existe
    if (!user) {
        return res.status(404).json({
            message: 'Usuário não encontrado.'
        });
    }

    // Retornar usuário sem a senha
    return res.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email
    });
});

// Atualizar usuário por ID
app.put('/users/:id', (req, res) => {
    const id = Number(req.params.id);
    const { name, email ,password } = req.body;

    // Validar ID
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: 'Informe um ID válido.'
        });
    }

    // Buscar usuário pelo ID
    const user = users.find(user => user.id === id);

    // Verificar se o usuário existe
    if (!user) {
        return res.status(404).json({
            message: 'Usuário não encontrado.'
        });
    }

    // Validar os novos dados
    if (
        typeof name !== 'string' || !name.trim() ||
        typeof password !== 'string' || !password ||
        typeof email !== 'string' || !email
    ) {
        return res.status(400).json({
            message: 'Informe um nome e uma senha válidos para atualizar o usuário.'
        });
    }

    // Atualizar os atributos do usuário
    user.name = name.trim();
    user.email = email.trim().toLowerCase();
    user.passwordHash = bcrypt.hashSync(password, 10);

    // Retornar resposta sem expor a senha
    return res.status(200).json({
        message: 'Usuário atualizado com sucesso!',
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    });
});

app.delete('/users/:id', (req,res) => {
    const id = Number(req.params.id)

    
    
    if (!Number.isInteger(id) || id <= 0){
        return res.status(400).json({
            message: 'Usuario não encontrado'
        })
    }
    const user = users.findIndex(user => user.id === id)

    if(user === -1){
        return res.status(404).json({
            message: 'Usuario não encontrado'
        })
    }
    
    users.splice(user,1)

      return res.status(200).json({
        message: 'Usuário removido com sucesso!'})

})

// Login (e-mail + senha)
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (typeof email !== 'string' || !email.trim() || typeof password !== 'string' || !password) {
        return res.status(400).json({
            message: 'E-mail e senha são obrigatórios.'
        });
    }

    const user = users.find(u => u.email === email.trim().toLowerCase());

    // Mesma resposta para e-mail inexistente e senha errada (não revela quais e-mails existem)
    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
        return res.status(401).json({
            message: 'E-mail ou senha inválidos.'
        });
    }

    return res.status(200).json({
        message: 'Login realizado com sucesso!',
        user: { id: user.id, name: user.name, email: user.email }
    });
});


// Cadastro de pets


app.post('/pets',(req,res) => {
    const {nome,raca,idade,tipo,cor,idU} = req.body
    
    if(
        typeof nome !=='string' || !nome.trim() || 
        typeof raca !== 'string' || !raca.trim() ||
        typeof idade !== 'number' ||
        typeof tipo !== 'string' || !tipo.trim() ||
        typeof cor !== 'string' || !cor.trim() ||
        typeof idU !== 'number'

    ){
        return res.status(400).json({
            message:'Algum dos itens não foi preenchido'
        })
    }

    const novoPet = {
        id : nextPets++,
        idU: idU,
        nome: nome.trim(),
        raca: raca.trim(),
        idade: idade,
        tipo: tipo.trim(),
        cor: cor.trim()

    }

    pet.push(novoPet)

    return res.status(201).json({
        message: 'Pet cadastrado com sucesso!',
        pet: {
            id: novoPet.id,
            idU: novoPet.idU,
            nome: novoPet.nome,
            raca: novoPet.raca,
            idade: novoPet.idade,
            tipo: novoPet.tipo,
            cor: novoPet.cor
        }
    })
  
})


app.get('/pets',(req,res) => {

    const safepets = pet.map(({id,idU,nome,raca,idade,tipo,cor}) => ({
        id,
        idU,
        nome,
        raca,
        idade,
        tipo,
        cor
    }))
    return res.status(200).json(safepets)
  
})

app.get('/pets/:id',(req,res) => {
    
    const id = Number(req.params.id)

    if (!Number.isInteger(id) || id <= 0){
        return res.status(400).json({
            message: 'Informe um id valido'
        })
    }

    const pets = pet.find(u => u.id === id)

    if (!pets){
        return res.status(404).json({
            message: 'Pet não encontrado'
        })
    }

    return res.status(200).json({
        id: pets.id,
        idU: pets.idU,
        nome: pets.nome,
        raca: pets.raca,
        idade: pets.idade,
        tipo: pets.tipo,
        cor: pets.cor
        
    })

})

app.put('/pets/:id',(req,res) => {
    const id = Number(req.params.id)
    const {nome,raca,idade,tipo,cor,idU} = req.body

    if (!Number.isInteger(id) || id <= 0){
        return res.status(400).json({
            message: 'Informe um id valido'
        })
    }

    const pets = pet.find(u => u.id === id)

    if(!pets){
        return res.status(404).json({
            message: 'Pet não encontrado'
        })
    }

    if(
        typeof nome !=='string' || !nome.trim() || 
        typeof raca !== 'string' || !raca.trim() ||
        typeof idade !== 'number' ||
        typeof tipo !== 'string' || !tipo.trim() ||
        typeof cor !== 'string' || !cor.trim() ||
        typeof idU !== 'number'
    ){
        return res.status(400).json({
            message:'Algum dos itens não foi preenchido'
        })
    }
    pets.idU = idU
    pets.nome = nome.trim()
    pets.raca = raca.trim()
    pets.idade = idade
    pets.tipo = tipo.trim()
    pets.cor = cor.trim()

    return res.status(200).json({
        message: 'Pet atualizado com sucesso!',
        pet: {
        id: pets.id,
        idU: pets.idU,
        nome: pets.nome,
        raca: pets.raca,
        idade: pets.idade,
        tipo: pets.tipo,
        cor: pets.cor
        }
    })

})

app.delete('/pets/:id',(req, res) => {
    const id = Number(req.params.id)

    if (!Number.isInteger(id) || id <= 0){
        return res.status(400).json({
            message: 'Informe um id valido'
        })
    }

    const pets = pet.findIndex(u => u.id ===  id)

    if(pets === -1){
        return res.status(404).json({
            message: 'Pet não encontrado'
        })
    }

    pet.splice(pets,1)

    return res.status(200).json({
        message: 'Pet removido com sucesso!'
    })


      
})

app.get ('/user/:userid/pets',(req,res) => {

    const id = Number(req.params.userid)

    if(isNaN(id)|| id <= 0){
        return res.status(400).json({
            message: 'Informe um id valido'
        })

    }

    const pets = pet.filter(p => p.idU === id)

    if (!pets){
        return res.status(404).json({
            message:  'Pet não encontrado'
        })
    }

    return res.status(200).json(pets)

  
})

// Agendamento 

app.post('/agendamento',(req,res) => {
    const {idU, petId, servico, data} = req.body
    
    if(
        typeof idU !== 'number' ||
        typeof petId !== 'number' ||
        typeof servico !== 'string' || !servico.trim() ||
        typeof data !== 'string' || !data.trim()

    ){
        return res.status(400).json({
            message:'Algum dos itens não foi preenchido'
        })
    }

    const donoAgendamento = users.find(u => u.id === idU)
    if(!donoAgendamento){
        return res.status(404).json({
            message: 'Usuário não encontrado'
        })
    }

    const petAgendamento = pet.find(p => p.id === petId)
    if(!petAgendamento){
        return res.status(404).json({
            message: 'Pet não encontrado'
        })
    }

    if(petAgendamento.idU !== idU){
        return res.status(400).json({
            message: 'O pet não pertence ao usuário informado'
        })
    }

    const novoAgendamento = {
        id : nextAgendamento++,
        idU: idU,
        petId: petId,
        servico: servico.trim(),
        data: data.trim()
    }

    agendamento.push(novoAgendamento)

    return res.status(201).json({
        message: 'Agendamento cadastrado com sucesso!',
        agendamento: novoAgendamento
    })
  
})

app.get ('/agendamento',(req, res) => {

    const safeAgendamento = agendamento.map(({id,idU,petId,servico,data}) => ({
        id,
        idU,
        petId,
        servico,
        data
        
      
    }))
    return res.status(200).json(safeAgendamento)
  
})

app.get ('/agendamento/:id',(req,res) => {
    const id = Number(req.params.id)

    if(!Number.isInteger(id) || id <= 0 ){
        return res.status(400).json({
            message: 'Informe um id valido'
        })

    }
    const novoAgendamento = agendamento.find(a => a.id ===id)

    if(!novoAgendamento){
        return res.status(404).json({
            message: 'Agendamento não encontrado'
        })
    }

    return res.status(200).json({
        id : novoAgendamento.id,
        idU: novoAgendamento.idU,
        petid: novoAgendamento.petId,
        servico: novoAgendamento.servico,
        data: novoAgendamento.data
    })
  
})


app.put('/agendamento/:id',(req,res) => {
    const id = Number(req.params.id)
    const {servico,data} = req.body


    if(!Number.isInteger(id) || id <= 0){
        return res.status(400).json({
            message: 'Informe um id valido'
        })
    }

    const agendamentos = agendamento.find(a => a.id === id)

    if(!agendamentos){
        return res.status(400).json({
            message: 'Agendamento não encontrado'
        })
    }

    if(
        
        typeof servico !== "string" || !servico ||
        typeof data !== 'string' || !data
    ){
        return res.status(400).json({
            message: 'Preencha todos os campos'
        })

    }

  
    agendamentos.servico = servico.trim()
    agendamentos.data = data.trim()


    return res.status(200).json({
        message: 'Agendamento atualizado com sucesso!',
        agendamentos: {
        id : agendamentos.id,
        idU: agendamentos.idU,
        petid: agendamentos.petId,
        servico: agendamentos.servico,
        data: agendamentos.data
            
        }
    })
  
})

app.delete('/agendamento/:id',(req,res) => {
    const id = Number(req.params.id)

    if (!Number.isInteger(id) || id <= 0){
        return res.status(400).json({
            message: 'Agendamento não encontrado'
        })
    }
    
    const agendamentos = agendamento.findIndex(a => a.id === id)

    if(agendamentos === -1){
        return res.status(404).json({
            message: 'Agendamento não encontrado'
        })
    }

    agendamento.splice(agendamentos, 1)

    return res.status(200).json({
        message: 'Agendamento removido com sucesso!'
    })

  
})


app.get('/user/:userid/agendamento',(req,res) => {

    const id = Number(req.params.userid)

    if(isNaN(id) || id <= 0){
        return res.status(400).json({
            message: 'Informe um id valido'
        })
    }
  

    const agendamentos = agendamento.filter(a => a.idU === id)


    if (!agendamentos){
        return res.status(404).json({
            message: 'Agendamento não encontrado'
        })
    }

    return res.status(200).json(agendamentos)
})

app.listen(PORT, () => {
    console.log(`API Pet Care rodando em http://localhost:${PORT}`);
});
