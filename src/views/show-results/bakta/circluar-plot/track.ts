export interface Track<T extends Track<T>> {
  /**
   * The height of the track in px.
   */
  height(): number;
}

export interface RadialTrack<T> extends Track<RadialTrack<T>> {
  /**
   * The outer radius of this track. The track will plot its data inwards.
   * The inner radius is defined by the radius - the height of the track.
   */
  radius(): number;
  radius(r: number): RadialTrack<T>;
}
