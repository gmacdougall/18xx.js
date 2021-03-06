import { List } from 'immutable';

import * as React from 'react';
import { ReactElement } from 'react';
import * as renderer from 'react-test-renderer';

import MapHex from '../../src/components/map_hex';
import Tile from '../../src/components/tile';

describe('MapHex', () => {
  describe('#absoluteLeft', () => {
    describe('when column is one', () => {
      it('returns zero', () => {
        const subject: MapHex = new MapHex({ row: 'a', column: 1 });
        expect(subject.absoluteLeft).toEqual(0);
      });
    });

    describe('when column is 6', () => {
      it('returns 277.5', () => {
        const subject: MapHex = new MapHex({ row: 'a', column: 6 });
        expect(subject.absoluteLeft).toBeCloseTo(277.128);
      });
    });
  });

  describe('#absoluteTop', () => {
    describe('when row is a', () => {
      it('returns zero', () => {
        const subject: MapHex = new MapHex({ row: 'a', column: 1 });
        expect(subject.absoluteTop).toEqual(0);
      });
    });

    describe('when row is g', () => {
      it('returns something else', () => {
        const subject: MapHex = new MapHex({ row: 'g', column: 6 });
        expect(subject.absoluteTop).toEqual(576);
      });
    });
  });

  describe('#hex', () => {
    it('returns the row and column', () => {
      const subject: MapHex = new MapHex({ row: 'u', column: 46 });
      expect(subject.hex).toEqual('u46');
    });
  });

  describe('#toString()', () => {
    it('returns the SVG for this element', () => {
      const subject: any = renderer.create(
        <MapHex row='e' column={11} />
      );
      expect(subject).toMatchSnapshot();
    });

    describe('when it contains a tile', () => {
      it('draws the tile at the end', () => {
        const tile: ReactElement<Tile> = (
          <Tile color='yellow' />
        );
        const subject: any = renderer.create(
          <MapHex row='e' column={11} tile={tile} />
        );
        expect(subject).toMatchSnapshot();
      });
    });

    describe('when it contains some elements', () => {
      it('draws the tile at the end', () => {
        const elements: List<string> = List(['ELEMENT']);
        const subject: any = renderer.create(
          <MapHex row='e' column={11} elements={elements} />
        );
        expect(subject).toMatchSnapshot();
      });
    });
  });
});
