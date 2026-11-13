using B2303828.Models;
using B2303828.Services;

string baseDir = AppDomain.CurrentDomain.BaseDirectory;
string booksPath = Path.Combine(baseDir, "Data", "books.csv");
string transactionsPath = Path.Combine(baseDir, "Data", "transactions.csv");

CsvService csvService = new();

List<Book> books = csvService.ReadBook(booksPath);
List<Transaction> transactions = csvService.ReadTransaction(transactionsPath);

Console.WriteLine("-------Du lieu sach:");
foreach (Book book in books)
{
    Console.Write($"Book ID: {book.Id} -- Book Name: {book.Name} -- Book Quantity: {book.Quantity} --  Price: {book.Price}");
    Console.WriteLine();
}
Console.WriteLine();
Console.WriteLine("-------Du lieu giao dich:");
foreach (Transaction transaction in transactions)
{
    Console.Write($"ID: {transaction.TransactionId} -- BookID: {transaction.BookId} -- Request quantity: {transaction.RequestQuantity} -- Price: {transaction.Price}");
    Console.WriteLine();
}
Console.WriteLine();

string logFile = Path.Combine(baseDir, "logs.txt");
BookStoreService bookStoreService = new BookStoreService();
bookStoreService.ProcessTransactions(books, transactions, logFile);

