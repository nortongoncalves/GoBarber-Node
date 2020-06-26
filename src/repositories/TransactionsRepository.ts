import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface createTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const sumAllIncomes = this.transactions
      .filter(({ type }) => type === 'income')
      .reduce((sum, { value }) => {
        return sum + value;
      }, 0);
    const sumAllOutcome = this.transactions
      .filter(({ type }) => type === 'outcome')
      .reduce((sum, { value }) => {
        return sum + value;
      }, 0);
    const sumTotal = sumAllIncomes - sumAllOutcome;
    const balance = {
      income: sumAllIncomes,
      outcome: sumAllOutcome,
      total: sumTotal,
    };
    return balance;
  }

  public create({ title, value, type }: createTransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type });
    const balance = this.getBalance();
    const haveBalance = balance.total >= value;
    if (!haveBalance && type === 'outcome')
      throw Error('insufficient balance to complete the transaction');
    this.transactions.push(transaction);
    return transaction;
  }
}

export default TransactionsRepository;
