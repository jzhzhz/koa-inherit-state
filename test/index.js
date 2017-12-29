/* eslint-env mocha */
'use strict'

const http = require('http')
const should = require('should')
const Koa = require('koa')
const request = require('supertest')

const inheritState = require('..')

describe('koa-inherit-state', function () {
  it('this.state in middleware will inherit app.context.state', function (done) {
    const app = new Koa()
    app.context.state = { 'foo': 'bar' }
    app.use(inheritState())
    app.use(function * () {
      should(this.state.foo).be.equal('bar')
      this.status = 204
    })

    request(app.callback()).get('/')
      .expect(204).end(done)
  })

  it('different context.state will not affect others', function (done) {
    const app = new Koa()
    app.context.state = { 'foo': 'bar' }
    app.use(inheritState())
    app.use(function * () {
      should(this.state.foo).be.equal('bar')
      this.status = 204
    })

    const server = http.createServer(app.callback())
    request(server).get('/')
      .expect(204).end((err) => {
        if (err) return done(err)
        request(server).get('/')
          .expect(204).end(done)
      })
  })
})
