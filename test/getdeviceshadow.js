let chai = require('chai')
let chaihttp = require('chai-http')
let should = chai.should()
let server = require('../local')
const AWS = require('aws-sdk')


chai.use(chaihttp)
describe('testcase1', () => {
    it('Thingname present and is correct', (done) => {
        chai.request(server)
            .get('/v1/deviceshadow?thingname=RaspberryPi')
            .end((err,res) =>{
                res.should.have.status(200);
                res.text.should.contain('state');
                done();
            })
    });
});

describe('testcase2', () => {
    it('Thingname present and is incorrect', (done) => {
        chai.request(server)
            .get('/v1/deviceshadow?thingname=randomname')
            .end((err,res) =>{
                res.should.have.status(404);
                res.text.should.contain('No shadow exists');
                done();
            })
    });
});

describe('testcase3', () => {
    it('Thingname not present', (done) => {
        chai.request(server)
            .get('/v1/deviceshadow')
            .end((err,res) =>{
                res.should.have.status(400);
                res.text.should.contain('Please specify thingname');
                done();
            })
    });
});