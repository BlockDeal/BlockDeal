import { ethers } from 'ethers';

class SecurityManager {
  private static instance: SecurityManager;
  private readonly ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'default-key';

  private constructor() {}

  public static getInstance(): SecurityManager {
    if (!SecurityManager.instance) {
      SecurityManager.instance = new SecurityManager();
    }
    return SecurityManager.instance;
  }

  public sanitizeInput(input: string): string {
    // Remove potentially dangerous characters
    return input.replace(/[<>]/g, '');
  }

  public validateAddress(address: string): boolean {
    try {
      return ethers.utils.isAddress(address);
    } catch {
      return false;
    }
  }

  public validateAmount(amount: string): boolean {
    try {
      const value = ethers.utils.parseEther(amount);
      return value.gt(0);
    } catch {
      return false;
    }
  }

  public validateTransactionHash(hash: string): boolean {
    try {
      return ethers.utils.isHexString(hash, 32);
    } catch {
      return false;
    }
  }

  public encryptData(data: string): string {
    try {
      const cipher = ethers.utils.encryptJsonWallet(data, this.ENCRYPTION_KEY);
      return cipher;
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  public decryptData(encryptedData: string): string {
    try {
      const decrypted = ethers.utils.decryptJsonWallet(encryptedData, this.ENCRYPTION_KEY);
      return decrypted;
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  public generateNonce(): string {
    return ethers.utils.randomBytes(32).toString('hex');
  }

  public validateSignature(message: string, signature: string, address: string): boolean {
    try {
      const recoveredAddress = ethers.utils.recoverAddress(
        ethers.utils.hashMessage(message),
        signature
      );
      return recoveredAddress.toLowerCase() === address.toLowerCase();
    } catch {
      return false;
    }
  }

  public validateToken(token: string): boolean {
    // Implement JWT validation logic here
    return true;
  }

  public sanitizeUrl(url: string): string {
    try {
      const parsed = new URL(url);
      return parsed.toString();
    } catch {
      return '';
    }
  }
}

export const securityManager = SecurityManager.getInstance();

// Example usage:
/*
// Sanitize user input
const safeInput = securityManager.sanitizeInput(userInput);

// Validate Ethereum address
const isValidAddress = securityManager.validateAddress(address);

// Validate transaction amount
const isValidAmount = securityManager.validateAmount(amount);

// Encrypt sensitive data
const encryptedData = securityManager.encryptData(sensitiveData);

// Decrypt data
const decryptedData = securityManager.decryptData(encryptedData);

// Generate nonce for transaction
const nonce = securityManager.generateNonce();

// Validate signature
const isValidSignature = securityManager.validateSignature(message, signature, address);

// Sanitize URL
const safeUrl = securityManager.sanitizeUrl(userUrl);
*/ 