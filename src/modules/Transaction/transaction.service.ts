import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BankTransactionEntity } from 'src/entities/bankTransaction.entity';
import { CashTransactionEntity } from 'src/entities/cashTransaction.entity';
import { TransactionEntity } from 'src/entities/transaction.entity';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
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
  ) { }
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

  // Hàm chung cho việc tạo phiếu thu/chi
  async createTransactionWithHotelId(
    dto: CreateTransactionDto,
    userId: number,
    hotelId: number,
    transactionType: 'income' | 'expense',
    code: string,
  ): Promise<TransactionEntity> {
    // Tạo đối tượng TransactionEntity
    const transaction = this.transactionRepository.create({
      code: code, // Mã phiếu thu
      content: dto.content, // Nội dung phiếu thu
      note: dto.note, // Ghi chú
      amount: dto.amount, // Số tiền thu
      transactionType, // Loại giao dịch (thu/chi)
      paymentType: dto.paymentType, // Loại thanh toán
      user_id: userId, // Liên kết với người tạo phiếu
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

  // -------------------------------

  // Lấy danh sách chi tiết giao dịch, có lọc theo từ ngày đến ngày
  async getTransactionDetails(
    id: number,
    page: number = 1,
    limit: number = 8,
    type: string,
    fromDate?: string,
    toDate?: string,
  ): Promise<any> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }

    const hotelId = user.hotel_id;

    // Tính toán phân trang
    const skip = (page - 1) * limit;
    const take = limit;

    // Chọn các relation tùy thuộc vào loại giao dịch
    const relations = type === 'bank' ? ['user', 'bankTransaction'] : ['user'];

    // Khởi tạo truy vấn
    const query = this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.user', 'user') // Thêm join để lấy thông tin người tạo
      .leftJoinAndSelect('transaction.cashTransaction', 'cashTransaction')
      .where('transaction.hotel_id = :hotelId', { hotelId })
      .andWhere('transaction.paymentType = :paymentType', {
        paymentType: type,
      });

    // Áp dụng bộ lọc thời gian nếu có
    this.applyDateFilters(query, fromDate, toDate); // Truyền từ và đến ngày vào bộ lọc

    // Thực hiện truy vấn và phân trang
    const [transactions, totalCount] = await query
      .skip(skip)
      .take(take)
      .getManyAndCount();

    const result = transactions.map((transaction) => {
      const isIncome = transaction.transactionType === 'income';
      return {
        ID: transaction.id,
        Date: transaction.created_at,
        IncomeVoucherCode: isIncome ? transaction.code : null,
        ExpenseVoucherCode: !isIncome ? transaction.code : null,
        TransactionType: transaction.transactionType,
        IncomeAmount: isIncome ? Number(transaction.amount) : null,
        ExpenseAmount: !isIncome ? Number(transaction.amount) : null,
        CreatedBy: transaction.user ? transaction.user.user_name : null, // Lấy tên người tạo giao dịch
        content: transaction.content,
      };
    });

    // Tính toán tổng số tiền thu và chi
    const totalIncome = transactions
      .filter((transaction) => transaction.transactionType === 'income')
      .reduce((total, transaction) => total + Number(transaction.amount), 0);

    const totalExpense = transactions
      .filter((transaction) => transaction.transactionType === 'expense')
      .reduce((total, transaction) => total + Number(transaction.amount), 0);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      totalPages,
      totalIncome,
      totalExpense,
      transactions: result,
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
      user_id: updateDto.user_id ?? transaction.user_id,
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
      IdUser: transaction.user_id,
      ExtraDetails: extraDetails,
    };
  }
  // -------------------------------------------------------------------------------------

  /**
   * Lấy ID khách sạn của người dùng
   */
  async getHotelIdByUser(userId: number): Promise<number> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) throw new Error('User not found');
    return user.hotel_id;
  }

  /**
   * Áp dụng bộ lọc theo ngày bắt đầu và ngày kết thúc
   */
  applyDateFilters(
    query: any,
    fromDate: string | undefined,
    toDate: string | undefined,
  ) {
    // Lọc theo ngày nếu có `fromDate` và `toDate`
    if (fromDate) {
      const parsedFromDate = new Date(fromDate); // Chuyển đổi fromDate thành đối tượng Date
      if (!isNaN(parsedFromDate.getTime())) {
        // Đảm bảo ngày bắt đầu là 00:00:00 (chỉ so sánh ngày, không tính giờ)
        parsedFromDate.setHours(0, 0, 0, 0); // Reset giờ phút giây để chỉ so sánh ngày
        query.andWhere('transaction.created_at >= :fromDate', {
          fromDate: parsedFromDate,
        });
      } else {
        throw new Error('Invalid fromDate format');
      }
    }

    if (toDate) {
      const parsedToDate = new Date(toDate); // Chuyển đổi toDate thành đối tượng Date
      if (!isNaN(parsedToDate.getTime())) {
        // Đảm bảo ngày kết thúc là 23:59:59 (chỉ so sánh ngày, không tính giờ)
        parsedToDate.setHours(23, 59, 59, 999); // Reset giờ phút giây để bao gồm cả ngày
        query.andWhere('transaction.created_at <= :toDate', {
          toDate: parsedToDate,
        });
      } else {
        throw new Error('Invalid toDate format');
      }
    }
  }

  /**
   * Lấy phiếu thu chi tiền mặt
   */
  async getCashhTransactions(
    userId: number,
    type?: 'income' | 'expense',
    dateRange?: string,
    fromDate?: string,
    toDate?: string,
    page = 1,
    limit = 8,
  ) {
    console.log('service:', type, fromDate, toDate);

    const hotelId = await this.getHotelIdByUser(userId);

    // Khởi tạo query cơ bản
    const query = this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.cashTransaction', 'cashTransaction')
      .where('transaction.hotel_id = :hotelId', { hotelId })
      .andWhere('transaction.paymentType = :paymentType', {
        paymentType: 'cash',
      });

    // Áp dụng bộ lọc theo loại giao dịch nếu có
    if (type) {
      query.andWhere('transaction.transactionType = :type', { type });
    }

    // Áp dụng bộ lọc thời gian (dateRange, fromDate, toDate)
    this.applyDateFilters(query, fromDate, toDate);

    // Phân trang
    const [transactions, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    // Trả về kết quả
    return {
      transactions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
  /**
   * Lấy phiếu thu chi ngân hàng
   */
  async getBankTransactions(
    userId: number,
    type?: 'income' | 'expense',
    dateRange?: string,
    fromDate?: string,
    toDate?: string,
    page = 1,
    limit = 8,
  ) {
    console.log('service:', type, fromDate, toDate);

    const hotelId = await this.getHotelIdByUser(userId);

    // Khởi tạo query cơ bản cho giao dịch ngân hàng
    const query = this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.bankTransaction', 'bankTransaction') // Thay thế với bankTransaction
      .where('transaction.hotel_id = :hotelId', { hotelId })
      .andWhere('transaction.paymentType = :paymentType', {
        paymentType: 'bank',
      });

    // Áp dụng bộ lọc theo loại giao dịch nếu có
    if (type) {
      query.andWhere('transaction.transactionType = :type', { type });
    }

    // Áp dụng bộ lọc thời gian (dateRange, fromDate, toDate)
    this.applyDateFilters(query, fromDate, toDate);

    // Phân trang
    const [transactions, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    // Định dạng lại kết quả giao dịch ngân hàng
    const formattedTransactions = transactions.map((transaction) => ({
      id: transaction.id, // ID giao dịch
      code: transaction.code, // Mã giao dịch
      amount: Number(transaction.amount), // Số tiền giao dịch
      content: transaction.content, // Nội dung giao dịch
      date: transaction.created_at, // Ngày tạo giao dịch
      receiverAccount: transaction.bankTransaction?.receiverAccount || null, // Số tài khoản người nhận
      receiverName: transaction.bankTransaction?.receiverName || null, // Tên người nhận
    }));

    // Trả về kết quả
    return {
      transactions: formattedTransactions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
