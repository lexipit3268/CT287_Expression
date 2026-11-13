using B2303828.Models;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace B2303828.Services;

public class CsvService
{
    public List<Book> ReadBook(string filePath)
    {
        List<Book> books = new();
        if(!File.Exists(filePath))
        {
            Console.WriteLine("Khong tim thay file");
            return books;
        }

        string[] lines = File.ReadAllLines(filePath);
        foreach(string line in lines)
        {
            if (string.IsNullOrWhiteSpace(line))
            {
                continue;
            }
            string[] parts = line.Split(',');

            Book book = new Book(){
                Id = parts[0].Trim(),
                Name = parts[1].Trim(),
                Quantity = int.Parse(parts[2].Trim()),
                Price = double.Parse(parts[3].Trim())
            };
            books.Add(book);
        }
        return books;
    }

    public List<Transaction> ReadTransaction(string filePath)
    {
        List<Transaction> transactions = new();
        if (!File.Exists(filePath))
        {
            Console.WriteLine("Khong tim thay file");
            return transactions;
        }

        string[] lines = File.ReadAllLines(filePath);
        foreach (string line in lines)
        {
            if (string.IsNullOrWhiteSpace(line))
            {
                continue;
            }
            string[] parts = line.Split(',');

            Transaction transaction = new Transaction()
            {
                TransactionId = parts[0].Trim(),
                BookId = parts[1].Trim(),
                RequestQuantity = int.Parse(parts[2].Trim()),
                Price = double.Parse(parts[3].Trim())
            };
            transactions.Add(transaction);
        }
        return transactions;
    }
}
