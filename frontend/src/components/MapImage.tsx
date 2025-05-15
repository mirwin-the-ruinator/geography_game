import React from 'react';

type Props = {
  svg: string;
};

const MapImage = ({ svg }: Props) => (
  <div dangerouslySetInnerHTML={{ __html: svg }} />
);

export default MapImage;
