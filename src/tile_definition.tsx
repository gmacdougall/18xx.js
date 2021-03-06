import { List } from 'immutable';
import { ReactElement } from 'react';

import { DynamicValuesProps } from './components/dynamic_values';
import Tile from './components/tile';

import { PointDefinition } from './point';
import TileBuilder from './tile_builder';

export interface TileDefinitionCost {
  readonly amount: number;
  readonly color: string;
  readonly position: PointDefinition;
}

export type TileType =
  'City' |
  'DistinctCity' |
  'DoubleOCity' |
  'Town' |
  'UnconnectedCity';

export interface TileDefinitionInput {
  readonly color: string;
  readonly cost?: TileDefinitionCost;
  readonly dynamicValues?: DynamicValuesProps;
  readonly label?: string;
  readonly labelPosition?: PointDefinition;
  readonly num: string;
  readonly privateReservation?: string;
  readonly rotations?: number;
  readonly spots?: number;
  readonly spotLocations?: number[];
  readonly track?: number[][];
  readonly trackSpecial?: any; // FIXME: Has special type
  readonly trackToCenter?: number[];
  readonly type?: TileType;
  readonly value?: number;
}

export default class TileDefinition {
  constructor(private definition: TileDefinitionInput) {
    this.definition = definition;
  }

  public get color(): string {
    return this.definition.color;
  }

  public get cost(): TileDefinitionCost {
    return this.definition.cost;
  }

  public get dynamicValues(): DynamicValuesProps {
    return this.definition.dynamicValues;
  }

  public get label(): string {
    return this.definition.label;
  }

  public get labelPosition(): PointDefinition {
    return this.definition.labelPosition;
  }

  public get num(): string {
    return this.definition.num;
  }

  public get privateReservation(): string {
    return this.definition.privateReservation;
  }

  public get rotations(): number {
    return this.definition.rotations || 6;
  }

  public get spots(): number {
    return this.definition.spots;
  }

  public get spotLocations(): number[] {
    return this.definition.spotLocations;
  }

  public get track(): number[][] {
    return this.definition.track;
  }

  public get trackSpecial(): any { // FIXME: Has specific type
    return this.definition.trackSpecial;
  }

  public get trackToCenter(): number[] {
    return this.definition.trackToCenter;
  }

  public get type(): TileType {
    return this.definition.type;
  }

  public get value(): number {
    return this.definition.value;
  }

  public get allRotations(): List<ReactElement<Tile>> {
    return List(Array.from(
      new Array(this.rotations), (_: any, i: number) => this.tile(i)
    ));
  }

  public tile(rotation: number): ReactElement<Tile> {
    return new TileBuilder().buildTile(
      this,
      rotation
    );
  }
}
