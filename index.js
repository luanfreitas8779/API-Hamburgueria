const express = require('express')
const app = express()
const port = 3000
const uuid = require('uuid')
app.use(express.json())

const orders = []

const middleware = (request, response, next) => {
    const {id} = request.params

    const index = orders.findIndex((order) => order.id === id)

    if(index < 0){
        return response.status(404).json({Error: "Order not found"})
    }

    request.index = index

    next()

}

const methodUrl = (request, response, next) => {
  const method = request.method
  const url = request.url

  console.log(method, url)
  next()
}

app.get('/order', methodUrl, function (request, response) {

  return response.json(orders)
})

app.get('/order/:id', middleware, methodUrl, function (request, response) {
    const index = request.index
    return response.json(orders[index])
  })

app.post('/order', methodUrl, function (request, response) {
    const {order, clientName, price} = request.body

    const demand = {id: uuid.v4(), order, clientName, price, status: "Em preparação"}

    orders.push(demand)
    
    return response.status(201).json(demand)
  })

  app.put('/order/:id', middleware, methodUrl, function (request, response) {
    const id = request.params
    const index = request.index

    orders[index].status = "Pronto"  
    
    return response.json(orders[index])
  })

  app.delete('/order/:id', middleware, methodUrl, function (request, response) {
    const index = request.index

    orders.splice(index, 1)
    
    return response.status(204).json()
  })



  app.listen(port, console.log(`🚀 Server started on port ${port} 🚀`))