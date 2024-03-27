const express = require('express')
const port = 3002
const app = express()
app.use(express.json())
const { v4: uuidv4 } = require('uuid')

let orders = []

const checkIdExists = (request, response, next) => {
    const { id } = request.params;
    const order = orders.find(order => order.id === id);
    if (!order) {
        return response.status(404).json({ error: 'Pedido nao encontrado.'})
    }

    next()
}

const logRequest = (request, response, next) => {
    console.log(`Metodo: ${request.method}, URL: ${request.originalUrl}`);
    next();
}

app.post('/order', (request, response) => {
    const { order, clientName, price } = request.body
    const newOrders = {
        id: uuidv4(),
        order,
        clientName,
        price,
        status: "Em Preparacao"
    }
    orders.push(newOrders);
    response.status(201).json(newOrders)
})

app.get('/users', (request, response) => {
    response.json(orders)
})

app.put('/order/:id', checkIdExists, (request, response) => {
    const { id } =  request.params
    const index = orders.findIndex(order => order.id === id)
    orders[index] = {...orders[index], ...request.body };
    response.json(orders[index]);
})

app.delete('/order/:id', checkIdExists, (request, response) => {
    const { id } = request.params
    const cancelOrder = orders.findIndex(order => order.id === id)
    if (cancelOrder !== -1)  {
        orders[cancelOrder].status = "Pedido Cancelado!"
        return response.status(200).json({ message: "Pedido Cancelado com sucesso!"})
    }
     response.status(404).json({ error: "Pedido nao encontrado!"})
})

app.get('/order/:id', checkIdExists, (request, response) =>{
    const { id } = request.params
    const order = orders.find(order => order.id === id)
    response.json(order)
}) 

app.patch('/oirder/:id', checkIdExists, (request, response) => {
    const { id } = request.params
    const index = orders.findIndex(order => order.id === id)
    orders[index].status = "pronto"
    response.json(orders[index])
})


app.use(logRequest)
















app.listen(port,() => {
    console.log(`Server started on port ${port}`)
})