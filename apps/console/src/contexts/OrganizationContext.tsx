import React, { createContext, useContext, useState, ReactNode } from "react";

interface Organization {
  id: string;
  name: string;
  logoUrl: string;
}

interface OrganizationContextType {
  currentOrganization: Organization | null;
  setCurrentOrganization: (organization: Organization) => void;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(
  undefined,
);

export function useOrganization() {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error(
      "useOrganization must be used within an OrganizationProvider",
    );
  }
  return context;
}

interface OrganizationProviderProps {
  children: ReactNode;
}

export function OrganizationProvider({ children }: OrganizationProviderProps) {
  const [currentOrganization, setCurrentOrganization] =
    useState<Organization | null>(null);

  return (
    <OrganizationContext.Provider
      value={{ currentOrganization, setCurrentOrganization }}
    >
      {children}
    </OrganizationContext.Provider>
  );
}
