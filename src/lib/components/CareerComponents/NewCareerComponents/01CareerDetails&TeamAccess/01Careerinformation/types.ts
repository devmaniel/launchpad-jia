export interface CareerInformationProps {
  jobTitle: string;
  setJobTitle: (value: string) => void;
  onJobTitleBlur?: () => void;
  employmentType: string;
  setEmploymentType: (value: string) => void;
  onEmploymentTypeBlur?: () => void;
  workSetup: string;
  setWorkSetup: (value: string) => void;
  onWorkSetupBlur?: () => void;
  country: string;
  setCountry: (value: string) => void;
  province: string;
  setProvince: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  provinceList: any[];
  cityList: any[];
  setCityList: (value: any[]) => void;
  onProvinceBlur?: () => void;
  onCityBlur?: () => void;
  salaryNegotiable: boolean;
  setSalaryNegotiable: (value: boolean) => void;
  minimumSalary: string;
  setMinimumSalary: (value: string) => void;
  maximumSalary: string;
  setMaximumSalary: (value: string) => void;
  minimumSalaryCurrency: string;
  setMinimumSalaryCurrency: (value: string) => void;
  maximumSalaryCurrency: string;
  setMaximumSalaryCurrency: (value: string) => void;
  onMinimumSalaryBlur?: () => void;
  onMaximumSalaryBlur?: () => void;
  errors?: {
    jobTitle?: boolean;
    employmentType?: boolean;
    workSetup?: boolean;
    province?: boolean;
    city?: boolean;
    minimumSalary?: boolean;
    maximumSalary?: boolean;
  };
}

export interface BasicInformationProps {
  jobTitle: string;
  setJobTitle: (value: string) => void;
  onJobTitleBlur?: () => void;
  errors?: {
    jobTitle?: boolean;
  };
}

export interface WorkSettingProps {
  employmentType: string;
  setEmploymentType: (value: string) => void;
  onEmploymentTypeBlur?: () => void;
  workSetup: string;
  setWorkSetup: (value: string) => void;
  onWorkSetupBlur?: () => void;
  errors?: {
    employmentType?: boolean;
    workSetup?: boolean;
  };
}

export interface LocationProps {
  country: string;
  setCountry: (value: string) => void;
  province: string;
  setProvince: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  provinceList: any[];
  cityList: any[];
  setCityList: (value: any[]) => void;
  onProvinceBlur?: () => void;
  onCityBlur?: () => void;
  errors?: {
    province?: boolean;
    city?: boolean;
  };
}

export interface SalaryProps {
  salaryNegotiable: boolean;
  setSalaryNegotiable: (value: boolean) => void;
  minimumSalary: string;
  setMinimumSalary: (value: string) => void;
  maximumSalary: string;
  setMaximumSalary: (value: string) => void;
  minimumSalaryCurrency: string;
  setMinimumSalaryCurrency: (value: string) => void;
  maximumSalaryCurrency: string;
  setMaximumSalaryCurrency: (value: string) => void;
  onMinimumSalaryBlur?: () => void;
  onMaximumSalaryBlur?: () => void;
  errors?: {
    minimumSalary?: boolean;
    maximumSalary?: boolean;
  };
}

export interface SalaryInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  currency: string;
  onCurrencyChange: (currency: string) => void;
  hasError?: boolean;
  onBlur?: () => void;
  disabled?: boolean;
}
