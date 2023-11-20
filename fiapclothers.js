const mongoose = require ("mongoose")
const express = require ("express")
const bodyParser = require("body-parser")

const app = express ()
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
const port = 3000

mongoose.connect('mongodb://127.0.0.1:27017/fiaptech',
{
    useNewUrlParser : true,
    useUnifiedTopology : true,
    serverSelectionTimeoutMS : 20000
})


const UsuarioSchema =  new mongoose.Schema({
    nome : { type :String},
    email : {type : String, required : true},
    senha : {type : String}
})


const Usuario = mongoose.model("Usuario", UsuarioSchema)



app.post("/cadastrousuario", async(req,res)=>{
    const nome = req.body.nome
    const email = req.body.email
    const senha = req.body.senha

    if ( nome == "" || email == "" || senha == "" ){
        return res.status(400).json({error: "preencha todos os campos"})
    }

    const emailexiste = await Usuario.findOne({email:email})
    if(emailexiste){
        return res.status(400).json({error:"o email cadastrado já existe"})
    }

    const usuario = new Usuario({
        nome : nome,
        email: email,
        senha:senha,
    })

    try{
        const newUsuario = await usuario.save()
        res.json({error: null,msg: "Cadastro ok", UsuarioId : newUsuario._id})
    }

    catch(error){
        res.status(400).json((error))
    }
    
})


const ProdutoSchema =  new mongoose.Schema({
    
    codigo : {type : String, required : true},
    descricao : {type : String},
    fornecedor : { type :String},
    datafabricacao : { type :Date},
    quantidadestoque : { type :Number}
})


const Produto = mongoose.model("Produto", ProdutoSchema)



app.post("/cadastroproduto", async(req,res)=>{
    const codigo = req.body.codigo
    const descricao = req.body.descricao
    const fornecedor = req.body.fornecedor
    const datafabricacao = req.body.datafabricacao
    const quantidadestoque = req.body.quantidadestoque

    if ( codigo == "" || descricao == "" || fornecedor == "" || datafabricacao == "" || quantidadestoque == "" ){
        return res.status(400).json({error: "preencha todos os campos"})
    }

    const codigoexiste = await Produto.findOne({codigo:codigo})
    if(codigoexiste){
        return res.status(400).json({error:"este código já foi usado para outro produto"})
    }

    if(quantidadestoque<=1 || quantidadestoque>=50){
        return res.status(400).json({error:"O estoque vai de 1 a 50"})

    }

    const produto = new Produto({
        codigo: codigo,
        descricao: descricao,
        fornecedor: fornecedor,
        datafabricacao: datafabricacao,
        quantidadestoque: quantidadestoque,
    })

    try{
        const newProduto = await produto.save()
        res.json({error: null,msg: "Cadastro ok", UsuarioId : newProduto._id})
    }

    catch(error){
        res.status(400).json((error))
    }
    
})


app.get("/cadastrousuario", async(req, res)=>{
    res.sendFile(__dirname +"/cadastrousuario.html");
})

app.get("/cadastroproduto", async(req, res)=>{
    res.sendFile(__dirname +"/cadastroproduto.html");
})


app.get("/", async(req, res)=>{
    res.sendFile(__dirname +"/index.html");
})

//configurando a porta
app.listen(port, ()=>{
    console.log(`Servidor rodando na porta ${port}`);
})