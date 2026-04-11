export interface PackageDto {
  id: string;
  name: string;
  durationDays: number;
  price: number;
  discount: number;
  description: string | null;
  liveQuota: number | null;
  archiveQuota: number | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
}

export interface CreatePackageInput {
  name: string;
  durationDays: number;
  price: number;
  discount?: number;
  description?: string;
  liveQuota?: number;
  archiveQuota?: number;
  sortOrder?: number;
}

export interface UpdatePackageInput {
  name?: string;
  durationDays?: number;
  price?: number;
  discount?: number;
  description?: string;
  liveQuota?: number | null;
  archiveQuota?: number | null;
  sortOrder?: number;
  isActive?: boolean;
}

// --- Payment Transaction types ---

export interface PaymentTransactionDto {
  id: string;
  userId: string;
  packageId: string;
  amount: number;
  paymentMethod: string;
  mobileNumber: string;
  transactionId: string;
  status: string;
  adminNote: string | null;
  reviewedAt: Date | null;
  reviewedBy: string | null;
  createdAt: Date;
  // Joined fields
  packageName: string | null;
  userName: string | null;
  userMobile: string | null;
}

export interface SubmitPaymentInput {
  packageId: string;
  amount: number;
  paymentMethod: string;
  mobileNumber: string;
  transactionId: string;
}

export interface ReviewTransactionInput {
  adminNote?: string;
}

// --- User Package types ---

export interface UserPackageDto {
  id: string;
  userId: string;
  packageId: string;
  startDate: Date;
  endDate: Date;
  liveUsed: number;
  archiveUsed: number;
  isActive: boolean;
  createdAt: Date;
  packageName: string | null;
  packageLiveQuota: number | null;
  packageArchiveQuota: number | null;
}

// --- Profile types ---

export interface UserProfileDto {
  id: string;
  mobile: string;
  name: string | null;
  photo: string | null;
  role: string;
  isActive: boolean;
  createdAt: Date;
  activePackage: UserPackageDto | null;
}

export interface UpdateProfileInput {
  name?: string;
  photo?: string;
}
