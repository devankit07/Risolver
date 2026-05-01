import mongoose from 'mongoose'

/** Single mongoose connection shared by the HTTP server and Socket.IO handlers. */
export async function connectMongo(uri) {
  if (mongoose.connection.readyState === 1) return
  await mongoose.connect(uri)
}

export async function disconnectMongo() {
  await mongoose.disconnect()
}
