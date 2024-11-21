import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BankTransactionEntity } from 'src/entities/bankTransaction.entity';
import { CashTransactionEntity } from 'src/entities/cashTransaction.entity';
import { TransactionEntity } from 'src/entities/transaction.entity';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/createTransaction.dto';
import { UserEntity } from 'src/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { UpdateTransactionDto } from './dto/updateTransaction .dto';
@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionEntity)
    private transactionRepository: Repository<TransactionEntity>,
    @InjectRepository(BankTransactionEntity)
    private bankTransactionRepository: Repository<BankTransactionEntity>,
    @InjectRepository(CashTransactionEntity)
    private cashTransactionRepository: Repository<CashTransactionEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  //   -------------------------------------------------------------------------------------
  async createTransactionCash(
    dto: CreateTransactionDto,
    id: number,
    transactionType: 'income' | 'expense',
  ): Promise<any> {
    return this.createTransaction(dto, id, transactionType);
  }

  // Hàm chung cho việc tạo phiếu thu/chi
  private async createTransaction(
    dto: CreateTransactionDto,
    userId: number,
    transactionType: 'income' | 'expense',
  ): Promise<TransactionEntity> {
    // Lấy thông tin người dùng từ userId (người tạo giao dịch)
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    // Lấy thông tin người dùng mà user_id được chỉ định (người liên quan tới giao dịch)
    const Isuser = await this.userRepository.findOne({
      where: { id: dto.user_id },
    });
    if (!Isuser) {
      throw new Error('User not found');
    }

    // Kiểm tra xem người dùng nhập vào có cùng hotel_id với người tạo giao dịch không
    if (user.hotel_id !== Isuser.hotel_id) {
      throw new Error('The specified user does not belong to the same hotel.');
    }

    const hotelId = user.hotel_id; // Lấy hotel_id từ người tạo giao dịch
    let shortUuid = uuidv4().split('-')[0].slice(0, 5);
    let transactionCode: string;
    const transactionPrefixes = {
      income: { bank: 'PTCK', cash: 'PTTM' },
      expense: { bank: 'PCCK', cash: 'PCTM' },
    };

    transactionCode = `${transactionPrefixes[transactionType]?.[dto.paymentType] || 'UNKNOWN'}-${shortUuid}`;

    console.log('user id :' + dto.user_id);

    // Tạo đối tượng TransactionEntity
    const transaction = this.transactionRepository.create({
      code: transactionCode, // Mã phiếu thu
      content: dto.content, // Nội dung phiếu thu
      note: dto.note, // Ghi chú
      amount: dto.amount, // Số tiền thu
      transactionType, // Loại giao dịch (thu/chi)
      paymentType: dto.paymentType, // Loại thanh toán
      user_id: dto.user_id, // Liên kết với người tạo phiếu
      hotel_id: hotelId, // Liên kết với khách sạn
      isHandedOver: false, // Chưa bàn giao
      created_at: dto.created_at,
    });

    // Lưu phiếu thu vào cơ sở dữ liệu
    const savedTransaction = await this.transactionRepository.save(transaction);

    // Tạo thông tin giao dịch cho ngân hàng nếu là chuyển khoản
    if (dto.paymentType === 'bank') {
      const bankTransaction = this.bankTransactionRepository.create({
        receiverAccount: dto.receiverAccount, // Số tài khoản người nhận
        receiverName: dto.receiverName, // Tên người nhận
        bankAmount: dto.amount, // Số tiền chuyển khoản
        transaction: savedTransaction, // Liên kết với phiếu thu
      });
      await this.bankTransactionRepository.save(bankTransaction);
    }

    // Tạo thông tin giao dịch tiền mặt nếu là thanh toán bằng tiền mặt
    if (dto.paymentType === 'cash') {
      const cashTransaction = this.cashTransactionRepository.create({
        cashAmount: dto.amount, // Số tiền giao dịch bằng tiền mặt
        transaction: savedTransaction, // Liên kết với phiếu thu
      });
      await this.cashTransactionRepository.save(cashTransaction);
    }

    return savedTransaction;
  }

  // ------------------------------------------------------------------------------------------
  // Hàm lấy danh sách phiếu thu/chi tiền
  async getCashTransactions(
    id: number,
    type: string,
    page: number = 1,
    limit: number = 8,
  ): Promise<{
    total: number;
    totalPages: number;
    currentPage: number;
    transactions: any[];
  }> {
    // Lấy thông tin người dùng từ userId
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }

    const hotelId = user.hotel_id; // Lấy hotel_id từ user

    // Tính toán phân trang
    const offset = (page - 1) * limit;

    // Truy vấn tổng số giao dịch để tính tổng số trang
    const [transactions, total] = await this.transactionRepository.findAndCount(
      {
        where: { hotel_id: hotelId, paymentType: type }, // Lọc theo hotel_id và loại thanh toán
        select: [
          'id',
          'code',
          'amount',
          'content',
          'created_at',
          'transactionType',
        ], // Chỉ chọn các trường cần thiết
        skip: offset, // Bỏ qua số lượng giao dịch theo trang
        take: limit, // Giới hạn số lượng giao dịch theo trang
      },
    );

    // Tính tổng số trang
    const totalPages = Math.ceil(total / limit);

    return {
      total, // Tổng số giao dịch
      totalPages, // Tổng số trang
      currentPage: page, // Trang hiện tại
      transactions: transactions,
    };
  }
  //---
  async getBankTransactions(
    id: number,
    page: number = 1,
    limit: number = 8,
    type: string,
  ): Promise<{
    total: number;
    totalPages: number;
    currentPage: number;
    transactions: any[];
  }> {
    // Lấy thông tin người dùng từ userId
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }

    const hotelId = user.hotel_id; // Lấy hotel_id từ user

    // Tính toán phân trang
    const offset = (page - 1) * limit;

    // Truy vấn tổng số giao dịch ngân hàng để tính tổng số trang
    const [transactions, total] = await this.transactionRepository.findAndCount(
      {
        where: { hotel_id: hotelId, paymentType: 'bank' }, // Lọc theo hotel_id và loại thanh toán bank
        relations: ['bankTransaction'], // Liên kết với bảng bank_transaction
        skip: offset, // Bỏ qua số lượng giao dịch theo trang
        take: limit, // Giới hạn số lượng giao dịch theo trang
      },
    );

    // Định dạng lại dữ liệu trả về
    const formattedTransactions = transactions.map((transaction) => ({
      id: transaction.id, // ID giao dịch
      code: transaction.code, // Mã giao dịch
      amount: Number(transaction.amount), // Số tiền giao dịch
      content: transaction.content, // Nội dung giao dịch
      date: transaction.created_at, // Ngày tạo giao dịch
      receiverAccount: transaction.bankTransaction?.receiverAccount || null, // Số tài khoản người nhận
      receiverName: transaction.bankTransaction?.receiverName || null, // Tên người nhận
    }));

    // Tính tổng số trang
    const totalPages = Math.ceil(total / limit);

    return {
      total, // Tổng số giao dịch
      totalPages, // Tổng số trang
      currentPage: page, // Trang hiện tại
      transactions: formattedTransactions, // Danh sách giao dịch được định dạng
    };
  }

  // -------------------------------
  // lấy danh sách so sánh
  async getTransactionDetails(
    id: number,
    page: number = 1,
    limit: number = 8,
    type: string,
  ): Promise<any> {
    // Find user by id
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }

    const hotelId = user.hotel_id; // Get hotel_id from the user

    // Calculate pagination parameters
    const skip = (page - 1) * limit;
    const take = limit;

    // Include `bankTransaction` relation if type is 'bank'
    const relations = type === 'bank' ? ['user', 'bankTransaction'] : ['user'];

    // Query transactions of the hotel
    const [transactions, totalCount] =
      await this.transactionRepository.findAndCount({
        where: { hotel_id: hotelId, paymentType: type }, // Filter by payment type
        relations, // Include necessary relations
        skip,
        take,
      });

    // Map the results into the desired format
    const result = transactions.map((transaction) => {
      const isIncome = transaction.transactionType === 'income'; // Check if it's an income transaction

      // Base transaction details
      const transactionDetails = {
        ID: transaction.id, // Transaction ID
        Date: transaction.created_at, // Transaction date
        IncomeVoucherCode: isIncome ? transaction.code : null, // Income voucher code (if it's income)
        ExpenseVoucherCode: !isIncome ? transaction.code : null, // Expense voucher code (if it's expense)
        TransactionType: transaction.transactionType, // Transaction type (income/expense)
        IncomeAmount: isIncome ? Number(transaction.amount) : null, // Income amount (if it's income)
        ExpenseAmount: !isIncome ? Number(transaction.amount) : null, // Expense amount (if it's expense)
        CreatedBy: transaction.user ? transaction.user.user_name : null, // Creator's name
        content: transaction.content, // Content of the transaction
      };

      // Add bank-specific fields if type is 'bank'
      if (type === 'bank' && transaction.bankTransaction) {
        transactionDetails['ReceiverAccount'] =
          transaction.bankTransaction.receiverAccount;
        transactionDetails['ReceiverName'] =
          transaction.bankTransaction.receiverName;
      }

      return transactionDetails;
    });

    // Calculate total income and expense amounts for all transactions (not just the current page)
    const allTransactions = await this.transactionRepository.find({
      where: { hotel_id: hotelId, paymentType: type }, // Filter by payment type
      relations: type === 'bank' ? ['bankTransaction'] : [], // Include bankTransaction relation if type is 'bank'
    });

    const totalIncome = allTransactions
      .filter((transaction) => transaction.transactionType === 'income')
      .reduce((total, transaction) => total + Number(transaction.amount), 0); // Ensure amount is treated as a number

    const totalExpense = allTransactions
      .filter((transaction) => transaction.transactionType === 'expense')
      .reduce((total, transaction) => total + Number(transaction.amount), 0); // Ensure amount is treated as a number

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);

    return {
      totalPages, // Total number of pages
      totalIncome, // Total income amount for all transactions
      totalExpense, // Total expense amount for all transactions
      transactions: result, // List of transactions for the current page
    };
  }

  ///---------------------------------------------------------------------------
  async deleteTransaction(id: number): Promise<string> {
    // Tìm phiếu theo ID
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['bankTransaction', 'cashTransaction'], // Quan hệ với giao dịch phụ thuộc
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    // Xóa các giao dịch phụ thuộc nếu có
    if (transaction.bankTransaction) {
      await this.bankTransactionRepository.delete({ transaction: { id } });
    }
    if (transaction.cashTransaction) {
      await this.cashTransactionRepository.delete({ transaction: { id } });
    }

    // Xóa phiếu chính
    await this.transactionRepository.delete(id);

    return `Transaction with ID ${id} has been deleted successfully`;
  }
  //----------------------------------------------------------------------------
  async updateTransaction(
    id: number,
    updateDto: UpdateTransactionDto,
  ): Promise<TransactionEntity> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['bankTransaction', 'cashTransaction'],
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    // Ngăn chặn thay đổi transactionType và paymentType
    if (updateDto['transactionType'] || updateDto['paymentType']) {
      throw new BadRequestException(
        'Updating transactionType or paymentType is not allowed',
      );
    }

    // Cập nhật các trường khác
    Object.assign(transaction, {
      content: updateDto.content ?? transaction.content,
      note: updateDto.note ?? transaction.note,
      amount: updateDto.amount ?? transaction.amount,
      created_at: updateDto.created_at ?? transaction.created_at,
    });

    const updatedTransaction =
      await this.transactionRepository.save(transaction);

    if (transaction.paymentType === 'bank') {
      if (transaction.bankTransaction) {
        Object.assign(transaction.bankTransaction, {
          receiverAccount:
            updateDto.receiverAccount ??
            transaction.bankTransaction.receiverAccount,
          receiverName:
            updateDto.receiverName ?? transaction.bankTransaction.receiverName,
          bankAmount:
            updateDto.amount ?? transaction.bankTransaction.bankAmount,
        });
        await this.bankTransactionRepository.save(transaction.bankTransaction);
      }
    } else if (transaction.paymentType === 'cash') {
      if (transaction.cashTransaction) {
        Object.assign(transaction.cashTransaction, {
          cashAmount:
            updateDto.amount ?? transaction.cashTransaction.cashAmount,
        });
        await this.cashTransactionRepository.save(transaction.cashTransaction);
      }
    }

    return updatedTransaction;
  }
  //-----------------------------------------------------------------------------
  async getTransactionDetailsById(id: number): Promise<any> {
    // Tìm phiếu giao dịch trong bảng transaction
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['user'], // Thêm quan hệ với user để lấy thông tin người tạo
    });

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    let extraDetails = null;

    // Kiểm tra loại thanh toán để lấy thông tin chi tiết
    if (transaction.paymentType === 'bank') {
      // Lấy thông tin từ bảng bank_transaction
      const bankTransaction = await this.bankTransactionRepository.findOne({
        where: { transaction_id: id },
      });

      if (bankTransaction) {
        extraDetails = {
          receiverAccount: bankTransaction.receiverAccount,
          receiverName: bankTransaction.receiverName,
          bankAmount: bankTransaction.bankAmount,
        };
      }
    } else if (transaction.paymentType === 'cash') {
      // Lấy thông tin từ bảng cash_transaction
      const cashTransaction = await this.cashTransactionRepository.findOne({
        where: { transaction_id: id },
      });

      if (cashTransaction) {
        extraDetails = {
          cashAmount: cashTransaction.cashAmount,
        };
      }
    }

    // Trả về thông tin phiếu giao dịch
    return {
      ID: transaction.id,
      Code: transaction.code,
      Content: transaction.content,
      Note: transaction.note,
      Amount: transaction.amount,
      TransactionType: transaction.transactionType,
      PaymentType: transaction.paymentType,
      CreatedBy: transaction.user ? transaction.user.user_name : null,
      CreatedAt: transaction.created_at,
      HotelId: transaction.hotel_id,
      ExtraDetails: extraDetails,
    };
  }
}
