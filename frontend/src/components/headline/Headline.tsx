import { ReactNode } from 'react';

const Headline = ({ children }: { children: ReactNode }) => {
  return (
    <div className="text-center my-2">
      <h1 className="text-4xl">{children}</h1>
    </div>
  );
};
export default Headline;
