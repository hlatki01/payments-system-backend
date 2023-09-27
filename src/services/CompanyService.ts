import prismaClient from "../prisma";

interface CompanyRequest {
  companyId?: string;
  name?: string;
  email?: string;
  phone?: string;
  logo?: string;
}

class CompanyService {
  async create({ name, email, phone, logo }: CompanyRequest) {
    try {
      if (!email) {
        throw new Error("Email is required");
      }

      const companyAlreadyExists = await prismaClient.company.findFirst({
        where: {
          email: email,
        },
      });

      if (companyAlreadyExists) {
        throw new Error("Company already exists");
      }

      const company = await prismaClient.company.create({
        data: {
          name: name,
          email: email,
          phone: phone,
          logo: logo,
        },
      });

      return company;
    } catch (error) {
      throw new Error(`Company creation failed: ${error.message}`);
    }
  }

  async update({ companyId, name, email, phone, logo }: CompanyRequest) {
    try {
      if (!companyId || !name || !email || !phone || !logo) {
        throw new Error("All fields are mandatory");
      }

      const companyAlreadyExists = await prismaClient.company.findFirst({
        where: {
          email: email,
        },
      });

      const getCompanyInfo = await prismaClient.company.findFirst({
        where: {
          id: companyId,
        },
      });

      if (companyAlreadyExists && companyAlreadyExists.id !== getCompanyInfo.id) {
        throw new Error("Company already exists");
      }

      const company = await prismaClient.company.update({
        data: {
          name: name,
          email: email,
          phone: phone,
          logo: logo,
        },
        where: {
          id: companyId,
        },
      });

      return company;
    } catch (error) {
      throw new Error(`Company update failed: ${error.message}`);
    }
  }

  async one({ companyId }: CompanyRequest) {
    try {
      const company = await prismaClient.company.findFirst({
        where: {
          id: companyId,
        },
      });

      if (!company) {
        throw new Error("Company not found");
      }

      return company;
    } catch (error) {
      throw new Error(`Fetching company failed: ${error.message}`);
    }
  }

  async delete({ companyId }: CompanyRequest) {
    try {
      const company = await prismaClient.company.update({
        where: {
          id: companyId,
        },
        data: {
          deleted: true,
        },
      });

      if (!company) {
        throw new Error("Company not found");
      }

      return company;
    } catch (error) {
      throw new Error(`Company deletion failed: ${error.message}`);
    }
  }
}

export { CompanyService };
