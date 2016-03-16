module.exports = () => function * (next) {
  this.state = Object.assign(Object.create(this.app.context.state), this.state)
  return yield next
}
