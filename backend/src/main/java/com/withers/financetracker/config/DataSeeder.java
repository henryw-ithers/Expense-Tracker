package com.withers.financetracker.config;

import com.withers.financetracker.model.Category;
import com.withers.financetracker.repository.CategoryRepository;
import com.withers.financetracker.model.Transaction;
import com.withers.financetracker.repository.TransactionRepository;
import com.withers.financetracker.model.TransactionType;
import java.math.BigDecimal;
import java.time.LocalDate;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder {
    @Bean
    CommandLineRunner seedData(
            CategoryRepository categoryRepository,
            TransactionRepository transactionRepository
    ) {
        return args -> {
            if (categoryRepository.count() > 0 || transactionRepository.count() > 0) {
                return;
            }

            Category groceries = new Category();
            groceries.setName("Groceries");
            groceries = categoryRepository.save(groceries);

            Category rent = new Category();
            rent.setName("Rent");
            rent = categoryRepository.save(rent);

            Category salary = new Category();
            salary.setName("Salary");
            salary = categoryRepository.save(salary);

            Category entertainment = new Category();
            entertainment.setName("Entertainment");
            entertainment = categoryRepository.save(entertainment);

            Transaction paycheckOne = new Transaction();
            paycheckOne.setAmount(new BigDecimal("3200.00"));
            paycheckOne.setType(TransactionType.INCOME);
            paycheckOne.setDescription("Monthly paycheque");
            paycheckOne.setDate(LocalDate.now().minusDays(25));
            paycheckOne.setCategory(salary);
            transactionRepository.save(paycheckOne);

            Transaction rentPayment = new Transaction();
            rentPayment.setAmount(new BigDecimal("1450.00"));
            rentPayment.setType(TransactionType.EXPENSE);
            rentPayment.setDescription("Monthly rent");
            rentPayment.setDate(LocalDate.now().minusDays(22));
            rentPayment.setCategory(rent);
            transactionRepository.save(rentPayment);

            Transaction groceriesOne = new Transaction();
            groceriesOne.setAmount(new BigDecimal("86.45"));
            groceriesOne.setType(TransactionType.EXPENSE);
            groceriesOne.setDescription("Weekly groceries");
            groceriesOne.setDate(LocalDate.now().minusDays(18));
            groceriesOne.setCategory(groceries);
            transactionRepository.save(groceriesOne);

            Transaction entertainmentOne = new Transaction();
            entertainmentOne.setAmount(new BigDecimal("42.99"));
            entertainmentOne.setType(TransactionType.EXPENSE);
            entertainmentOne.setDescription("Movie night");
            entertainmentOne.setDate(LocalDate.now().minusDays(12));
            entertainmentOne.setCategory(entertainment);
            transactionRepository.save(entertainmentOne);

            Transaction groceriesTwo = new Transaction();
            groceriesTwo.setAmount(new BigDecimal("73.20"));
            groceriesTwo.setType(TransactionType.EXPENSE);
            groceriesTwo.setDescription("Groceries restock");
            groceriesTwo.setDate(LocalDate.now().minusDays(8));
            groceriesTwo.setCategory(groceries);
            transactionRepository.save(groceriesTwo);

            Transaction paycheckTwo = new Transaction();
            paycheckTwo.setAmount(new BigDecimal("3200.00"));
            paycheckTwo.setType(TransactionType.INCOME);
            paycheckTwo.setDescription("Monthly paycheque");
            paycheckTwo.setDate(LocalDate.now().minusDays(2));
            paycheckTwo.setCategory(salary);
            transactionRepository.save(paycheckTwo);
    };
}
}
