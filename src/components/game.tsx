import * as Immutable from 'immutable';
import { List, Map } from 'immutable';
import * as React from 'react';
import { ReactElement } from 'react';
import { createStore, Store } from 'redux';

import * as allTilesJson from '../../config/tiles.json';

import AvailableTiles from './available_tiles';
import AvailableTokens from './available_tokens';
import City from './city';
import MapBoard from './map_board';
import MapHex from './map_hex';
import Tile from './tile';

import { game, GameState } from '../reducers/game';

import Company from '../company';
import MapBuilder, { MapDefinition } from '../map_builder';
import { TileDefinitionInput } from '../tile_definition';
import TileSet, { TileSetDetails } from '../tile_set';

const allTiles: List<TileDefinitionInput> =
  Immutable.fromJS(allTilesJson).map(
    (el: any) => el.toJS() as TileDefinitionInput
  );

export interface GameProps {
  readonly gameName: string;
  readonly initialState?: GameState;
  readonly mapDef: MapDefinition;
}

export default class Game
  extends React.Component<GameProps, GameState> {

  public readonly tileSet: TileSet;
  private store: Store<any>;
  private mapBuilder: MapBuilder;

  constructor(props: GameProps) {
    super(props);

    this.store = createStore(
      game,
      props.initialState,
      (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
        (window as any).__REDUX_DEVTOOLS_EXTENSION__()
    );
    this.state = this.store.getState();
    this.store.subscribe(() =>
      this.setState(this.store.getState())
    );

    this.tileSet = new TileSet(
      allTiles,
      Map<string, TileSetDetails>(props.mapDef.tileManifest)
    );

    this.mapBuilder = new MapBuilder(
      this,
      this.props.mapDef,
      this.tileSet
    );
  }

  public render(): ReactElement<Game> {
    if (!this.state.tokens) { return null; }
    let topMenu: ReactElement<any>;

    switch (this.state.openMenu) {
      case 'TILE':
        topMenu = (
          <AvailableTiles
            show={true}
            tileFilter={this.state.tileFilter}
            onClick={this.placeTile}
            tiles={this.tileSet.all} />
        );
        break;
      case 'TOKEN':
        const companies: List<Company> = List<Company>(
          Object.keys(this.props.mapDef.companies).map(
            (reportingMark: string) => Company.find(reportingMark)
          )
        );
        topMenu = (
          <AvailableTokens companies={companies} onClick={this.placeToken} />
        );
        break;
      default:
    }

    return (
      <div>
        {topMenu}
        <MapBoard
        game={this}
        hexes={this.mapBuilder.getHexes(this.state.tiles, this.state.tokens)}
        addOnTop={this.mapBuilder.addOnTop}
        />
      </div>
    );
  }

  public onRightClickCity = (city: City, index: number): void => {
    this.store.dispatch({
      index,
      hex: city.props.hex,
      type: 'SHOW_AVAILABLE_TOKENS',
    });
  }

  public onHexClick = (hex: MapHex): void => {
    let tileFilter: List<string>;

    if (hex.props.tile && hex.props.tile.key !== 'pp') {
      const tileNum: string = hex.props.tile.key.toString().split('.')[0];
      tileFilter = (
        this.props.mapDef.tileManifest[tileNum].promotions || List<string>([])
      );
    } else {
      let rule: any = this.props.mapDef.tilePromotions.find(
        p => p.hexes && p.hexes.includes(hex.hex)
      );

      if (!rule) {
        rule = this.props.mapDef.tilePromotions.find(p => !p.hexes);
      }

      tileFilter = rule.promotions;
    }

    this.store.dispatch({
      hex: hex.hex,
      tileFilter,
      type: 'SHOW_AVAILABLE_TILES',
    });
  }

  private placeTile = (tile: ReactElement<Tile>): void => {
    this.store.dispatch({
      tile: tile.key,
      type: 'SELECT_TILE',
    });
    this.store.dispatch({
      type: 'CLOSE_MENUS',
    });
  }

  private placeToken = (company: Company): void => {
    this.store.dispatch({
      company: company.reportingMark,
      type: 'PLACE_TOKEN',
    });
    this.store.dispatch({
      type: 'CLOSE_MENUS',
    });
  }
}
