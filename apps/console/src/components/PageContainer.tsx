import { FC, ReactNode } from "react";
import { Helmet } from "react-helmet-async";

export interface PageContainerProps {
  children: ReactNode;
  title: string;
}

export const PageContainer: FC<PageContainerProps> = ({ children, title }) => {
  return (
    <>
      <Helmet>{`${title} - Probo Console`}</Helmet>
      <div className="container">{children}</div>
    </>
  );
};

export const PageContainerSkeleton: FC<{
  title?: string;
  children: ReactNode;
}> = ({ children, title }) =>
  title ? (
    <PageContainer title={title}>{children}</PageContainer>
  ) : (
    <div className="container">{children}</div>
  );
