import app from "./app.js"
import { connectToDataBase } from "./db/connection.js"

const PORT = process.env.PORT || 5000

connectToDataBase().then(() => {
  app.listen(PORT, () => {
    console.log(`server is connected to localhost:${PORT}`)
    console.log("server is open and connected to DB")
  })
})
.catch((err) => {
  console.log(err);
  throw new Error("something went wrong with connecting to the DB")
})


