import { expect } from 'chai';
import scope from '../../../src/model/scope';
import sinon from 'sinon';

describe('Scope Model', () => {
    it('should expose methods to deal with simple value', () => {
        const rootScope = scope();

        rootScope.set('hello', 'world');
        expect(rootScope.get('hello')).to.equal('world');
    });

    it('should expose methods to deal with object', () => {
        const rootScope = scope();

        rootScope.assign('obj', 'hello', 'again');
        expect(rootScope.get('obj').toJS()).to.deep.equal({
            hello: 'again',
        });

        rootScope.assign('obj', 'goodbye', 'again again');
        expect(rootScope.get('obj').toJS()).to.deep.equal({
            goodbye: 'again again',
            hello: 'again',
        });
    });

    it('should expose methods to deal with array', () => {
        const rootScope = scope();

        rootScope.push('arr', 'here');
        expect(rootScope.get('arr').toJS()).to.deep.equal([
            'here',
        ]);

        rootScope.push('arr', 'there');
        expect(rootScope.get('arr').toJS()).to.deep.equal([
            'here',
            'there',
        ]);
    });

    it('should return simple value from current scope or parent', () => {
        const rootScope = scope();
        rootScope.set('hello', 'world');
        rootScope.set('hello2', 'world2');
        rootScope.set('hello3', 'oops');

        const childScope = rootScope.new();
        childScope.set('hello3', 'world3');


        expect(rootScope.get('hello')).to.equal('world');
        expect(rootScope.get('hello3')).to.equal('oops');
        expect(childScope.get('hello2')).to.equal('world2');
        expect(childScope.get('hello3')).to.equal('world3');
    });

    it('should merge object values with parent scope', () => {
        const rootScope = scope();
        rootScope.assign('obj', 'hello', 'again');
        rootScope.assign('obj', 'goodbye', 'again again');

        const childScope = rootScope.new();
        childScope.assign('obj', 'good', 'bad');
        childScope.assign('obj', 'goodbye', 'again again again');

        const grandChildScope = childScope.new();
        grandChildScope.assign('obj', 'well', 'fine');

        expect(rootScope.get('obj').toJS()).to.deep.equal({
            goodbye: 'again again',
            hello: 'again',
        });

        expect(childScope.get('obj').toJS()).to.deep.equal({
            good: 'bad',
            goodbye: 'again again again',
            hello: 'again',
        });

        expect(grandChildScope.get('obj').toJS()).to.deep.equal({
            good: 'bad',
            goodbye: 'again again again',
            hello: 'again',
            well: 'fine',
        });
    });

    it('should merge array values with parent scope', () => {
        const rootScope = scope();
        rootScope.push('arr', 'here');
        rootScope.push('arr', 'there');

        const childScope = rootScope.new();
        childScope.push('arr', 'location');

        const grandChildScope = childScope.new();
        grandChildScope.push('arr', 'place');

        expect(rootScope.get('arr').toJS()).to.deep.equal([
            'here',
            'there',
        ]);

        expect(childScope.get('arr').toJS()).to.deep.equal([
            'here',
            'there',
            'location',
        ]);

        expect(grandChildScope.get('arr').toJS()).to.deep.equal([
            'here',
            'there',
            'location',
            'place',
        ]);
    });

    it('should expose a has method to test if a key exists', () => {
        const rootScope = scope();
        rootScope.set('hello', 'world');

        expect(rootScope.has('hello')).to.be.true;
        expect(rootScope.has('hello2')).to.be.false;
    });

    it('should expose emit/on/once methods to deal with events', () => {
        const rootScope = scope();
        const listener1 = sinon.spy();
        rootScope.on('test', listener1);

        const childScope = rootScope.new();
        const listener2 = sinon.spy();

        childScope.on('test', listener2);

        const grandChildScope = childScope.new();
        const listener3 = sinon.spy();
        grandChildScope.once('test', listener3);

        rootScope.emit('test', 'hello');
        expect(listener1.getCall(0).args).to.deep.equal([
            'hello',
        ]);

        childScope.emit('test', 'hola');
        expect(listener1.getCall(1).args).to.deep.equal([
            'hola',
        ]);
        expect(listener2.getCall(0).args).to.deep.equal([
            'hola',
        ]);

        grandChildScope.emit('test', 'hi');
        expect(listener1.getCall(2).args).to.deep.equal([
            'hi',
        ]);
        expect(listener2.getCall(1).args).to.deep.equal([
            'hi',
        ]);
        expect(listener3.getCall(0).args).to.deep.equal([
            'hi',
        ]);

        grandChildScope.emit('test', 'hi again');
        expect(listener1.getCall(3).args).to.deep.equal([
            'hi again',
        ]);
        expect(listener2.getCall(2).args).to.deep.equal([
            'hi again',
        ]);
        expect(listener3.callCount).to.equal(1);
    });
});
