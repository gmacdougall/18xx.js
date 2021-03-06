import { List } from 'immutable';
import * as React from 'react';
import { ReactElement } from 'react';

import CityCircle from './city_circle';
import Tile from './tile';
import Token from './token';
import Town from './town';

import Company from '../company';
import Point from '../point';

export interface CityProps {
  hex?: string;
  onRightClickCity: Function;
  num: number;
  points?: List<Point>;
  rotation?: number;
  spotLocations?: number[]; // FIXME: Refactor out to distinct city
  tokenState: List<string>;
  homeTokens: List<string>;
}

export interface Station {
  render(): ReactElement<Station>;
}

export default class City
extends React.Component<CityProps, undefined>
implements Station {
  public static defaultProps: CityProps = {
    homeTokens: List<string>(),
    tokenState: List<string>(),
  } as CityProps;

  public render(): ReactElement<City> {
    const num: number = this.props.num;
    let result: ReactElement<any>;

    if (num === 0) {
      result = (
        <Town key='town' points={List<Point>([Tile.CENTER])} />
      );
    } else if (num === 1) {
      result = (
        this.buildCircle(0, Tile.CENTER)
      );
    } else if (num === 2) {
      const background: ReactElement<any> = (
        <rect
          x={Tile.CENTER.x - CityCircle.RADIUS}
          y={Tile.CENTER.y - CityCircle.RADIUS}
          width={CityCircle.RADIUS * 2}
          height={CityCircle.RADIUS * 2 + CityCircle.STROKE_WIDTH}
          fill='black'
        />
      );
      const circles: List<ReactElement<CityCircle>> = List([
        this.buildCircle(
          0,
          new Point(
            Tile.CENTER.x - CityCircle.RADIUS,
            Tile.CENTER.y
          )
        ),
        this.buildCircle(
          1,
          new Point(
            Tile.CENTER.x + CityCircle.RADIUS,
            Tile.CENTER.y
          )
        )
      ]);
      result = (
        <g key='cities'>
          {background}
          {circles}
        </g>
      );
    } else if (num === 3) {
      const hexPoints: List<Point> = List([
        new Point(
          Tile.CENTER.x - CityCircle.RADIUS + 8,
          Tile.CENTER.y - 2 * CityCircle.RADIUS
        ),
        new Point(
          Tile.CENTER.x - 2 * CityCircle.RADIUS + 1,
          Tile.CENTER.y - CityCircle.RADIUS
        ),
        new Point(
          Tile.CENTER.x - 2 * CityCircle.RADIUS + 1,
          Tile.CENTER.y + CityCircle.RADIUS
        ),
        new Point(
          Tile.CENTER.x - CityCircle.RADIUS + 8,
          Tile.CENTER.y + 2 * CityCircle.RADIUS
        ),
        new Point(
          Tile.CENTER.x + CityCircle.RADIUS + 4,
          Tile.CENTER.y + CityCircle.RADIUS
        ),
        new Point(
          Tile.CENTER.x + CityCircle.RADIUS + 4,
          Tile.CENTER.y - CityCircle.RADIUS
        ),
      ]);

      const background: ReactElement<any> = (
        <polygon points={hexPoints.join(' ')} fill='black' />
      );

      const circles: List<ReactElement<CityCircle>> = List([
        this.buildCircle(
          0,
          new Point(
            Tile.CENTER.x - CityCircle.RADIUS + 2,
            Tile.CENTER.y - CityCircle.RADIUS
          )
        ),
        this.buildCircle(
          1,
          new Point(
            Tile.CENTER.x - CityCircle.RADIUS + 2,
            Tile.CENTER.y + CityCircle.RADIUS
          )
        ),
        this.buildCircle(
          2,
          new Point(
            Tile.CENTER.x + CityCircle.RADIUS - 2,
            Tile.CENTER.y
          )
        ),
      ]);

      result = (
        <g key='cities'>
          {background}
          {circles}
        </g>
      );
    } else if (num === 4) {
      const hexPoints: List<Point> = List([
        new Point(
          Tile.CENTER.x - CityCircle.RADIUS,
          Tile.CENTER.y - 2 * CityCircle.RADIUS
        ),
        new Point(
          Tile.CENTER.x - 2 * CityCircle.RADIUS,
          Tile.CENTER.y - CityCircle.RADIUS
        ),
        new Point(
          Tile.CENTER.x - 2 * CityCircle.RADIUS,
          Tile.CENTER.y + CityCircle.RADIUS
        ),
        new Point(
          Tile.CENTER.x - CityCircle.RADIUS,
          Tile.CENTER.y + 2 * CityCircle.RADIUS
        ),
        new Point(
          Tile.CENTER.x + CityCircle.RADIUS,
          Tile.CENTER.y + 2 * CityCircle.RADIUS
        ),
        new Point(
          Tile.CENTER.x + 2 * CityCircle.RADIUS,
          Tile.CENTER.y + CityCircle.RADIUS
        ),
        new Point(
          Tile.CENTER.x + 2 * CityCircle.RADIUS,
          Tile.CENTER.y - CityCircle.RADIUS
        ),
        new Point(
          Tile.CENTER.x + CityCircle.RADIUS,
          Tile.CENTER.y - 2 * CityCircle.RADIUS
        ),
      ]);

      const background: ReactElement<any> = (
        <polygon points={hexPoints.join(' ')} fill='black' />
      );

      const circles: List<ReactElement<CityCircle>> = List([
        this.buildCircle(
          0,
          new Point(
            Tile.CENTER.x - CityCircle.RADIUS,
            Tile.CENTER.y - CityCircle.RADIUS
          )
        ),
        this.buildCircle(
          1,
          new Point(
            Tile.CENTER.x - CityCircle.RADIUS,
            Tile.CENTER.y + CityCircle.RADIUS
          )
        ),
        this.buildCircle(
          2,
          new Point(
            Tile.CENTER.x + CityCircle.RADIUS,
            Tile.CENTER.y - CityCircle.RADIUS
          )
        ),
        this.buildCircle(
          3,
          new Point(
            Tile.CENTER.x + CityCircle.RADIUS,
            Tile.CENTER.y + CityCircle.RADIUS
          )
        ),
      ]);

      result = (
        <g key='cities'>
          {background}
          {circles}
        </g>
      );
    } else {
      throw new Error('Unsupported number of cities');
    }

    return result;
  }

  protected buildCircle(index: number, point: Point): ReactElement<CityCircle> {
    let fn: Function;
    if (!this.props.tokenState.get(index)) {
      fn = (event: MouseEvent) => {
        event.preventDefault();
        this.props.onRightClickCity(this, index);
      };
    }

    return (
      <CityCircle
        hex={this.props.hex}
        key={point.toString()}
        point={point}
        onContextMenu={fn}
        token={this.buildToken(index, point)}
      />
    );
  }

  private buildToken(index: number, point: Point): ReactElement<Token> {
    let token: ReactElement<Token>;
    let faded: boolean = false;
    let company: Company;

    if (this.props.tokenState.get(index)) {
      company = Company.find(this.props.tokenState.get(index));
    } else if (this.props.homeTokens.get(index)) {
      company = Company.find(this.props.homeTokens.get(index));
      faded = true;
    }

    if (company) {
      token = (
        <Token
        faded={faded}
        text={company.shorthand}
        primaryColor={company.primaryColor}
        secondaryColor={company.secondaryColor}
        textColor={company.textColor} />
      );
    }
    return token;
  }
}
