using B2303828.Models;

namespace B2303828.Services;

public class BookStoreService
{
    public void ProcessTransactions(List<Book> books, List<Transaction> transactions, string logFilePath)
    {
        List<string> logs = new();

        foreach (Transaction transaction in transactions)
        {
            Book? book = books.FirstOrDefault(b => b.Id == transaction.BookId);
            if (book == null)
            {
                continue;
            }

            if (book.Quantity == 0)
            {
                transaction.RequestQuantity = -transaction.RequestQuantity;
                string log = $"FAILS AT SALE {transaction.TransactionId} BOOK {transaction.BookId}";
                logs.Add(log);
            }
            else
            {
                if (book.Quantity >= transaction.RequestQuantity)
                {
                    book.Quantity -= transaction.RequestQuantity;
                }
                else
                {
                    transaction.RequestQuantity = book.Quantity;
                    book.Quantity = 0;
                }
                string log = $"SUCCEEDS AT SALE {transaction.TransactionId} BOOK {transaction.BookId}";
                logs.Add(log);
            }
        }

        File.WriteAllLines(logFilePath, logs);
        Console.WriteLine("----Ket qua logs.txt");
        logs.ForEach(log => Console.WriteLine(log));
    }
}