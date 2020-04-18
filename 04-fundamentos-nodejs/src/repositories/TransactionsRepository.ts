import Transaction from '../models/Transaction';

interface TransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
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
    return this.transactions.reduce(
      (balance: Balance, transaction: Transaction) => {
        if (transaction.type === 'income') {
          balance.income += transaction.value;
          balance.total += transaction.value;
        } else {
          balance.outcome += transaction.value;
          balance.total -= transaction.value;
        }
        return balance;
      },
      { income: 0, outcome: 0, total: 0 },
    );
  }

  public create({ title, value, type }: TransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
