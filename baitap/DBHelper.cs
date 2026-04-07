using System;
using System.Configuration;
using System.Data;
using System.Data.SQLite;
using System.IO;
using System.Windows.Forms;

namespace StudentManagement
{
    public class DBHelper
    {
        private readonly string dbFile;
        private readonly string connStr;

        public DBHelper()
        {
            string configured = ConfigurationManager.ConnectionStrings["StudentDBConnectionString"]?.ConnectionString;
            if (string.IsNullOrWhiteSpace(configured))
            {
                dbFile = "StudentDB.db";
                connStr = $"Data Source={dbFile};Version=3;";
            }
            else
            {
                connStr = configured;
                SQLiteConnectionStringBuilder builder = new SQLiteConnectionStringBuilder(connStr);
                dbFile = string.IsNullOrWhiteSpace(builder.DataSource) ? "StudentDB.db" : builder.DataSource;
            }

            InitializeDatabase();
        }

        private void InitializeDatabase()
        {
            if (!File.Exists(dbFile))
            {
                SQLiteConnection.CreateFile(dbFile);
            }

            using (SQLiteConnection conn = new SQLiteConnection(connStr))
            {
                conn.Open();

                string createKhoa = @"
                    CREATE TABLE IF NOT EXISTS Khoa (
                        MaKhoa INTEGER PRIMARY KEY,
                        TenKhoa TEXT NOT NULL
                    );";

                string createMon = @"
                    CREATE TABLE IF NOT EXISTS Mon (
                        MaMH INTEGER PRIMARY KEY,
                        TenMH TEXT NOT NULL,
                        SoTiet INTEGER NOT NULL
                    );";

                string createSinhVien = @"
                    CREATE TABLE IF NOT EXISTS SinhVien (
                        MaSo INTEGER PRIMARY KEY,
                        HoTen TEXT NOT NULL,
                        NgaySinh TEXT,
                        GioiTinh INTEGER,
                        DiaChi TEXT,
                        DienThoai TEXT,
                        MaKhoa INTEGER,
                        FOREIGN KEY (MaKhoa) REFERENCES Khoa(MaKhoa)
                    );";

                string createKetQua = @"
                    CREATE TABLE IF NOT EXISTS KetQua (
                        MaSo INTEGER,
                        MaMH INTEGER,
                        Diem REAL,
                        PRIMARY KEY (MaSo, MaMH),
                        FOREIGN KEY (MaSo) REFERENCES SinhVien(MaSo),
                        FOREIGN KEY (MaMH) REFERENCES Mon(MaMH)
                    );";

                ExecuteNonQueryInternal(createKhoa, conn);
                ExecuteNonQueryInternal(createMon, conn);
                ExecuteNonQueryInternal(createSinhVien, conn);
                ExecuteNonQueryInternal(createKetQua, conn);

                // Sample data
                ExecuteNonQueryInternal("INSERT OR IGNORE INTO Khoa(MaKhoa, TenKhoa) VALUES(1, 'CNTT')", conn);
                ExecuteNonQueryInternal("INSERT OR IGNORE INTO Khoa(MaKhoa, TenKhoa) VALUES(2, 'Kế toán')", conn);
                ExecuteNonQueryInternal("INSERT OR IGNORE INTO Khoa(MaKhoa, TenKhoa) VALUES(3, 'Quản trị kinh doanh')", conn);
                ExecuteNonQueryInternal("INSERT OR IGNORE INTO Khoa(MaKhoa, TenKhoa) VALUES(4, 'Ngoại ngữ')", conn);
                ExecuteNonQueryInternal("INSERT OR IGNORE INTO Khoa(MaKhoa, TenKhoa) VALUES(5, 'Điện - Điện tử')", conn);

                ExecuteNonQueryInternal("INSERT OR IGNORE INTO Mon(MaMH, TenMH, SoTiet) VALUES(101, 'Lập trình C#', 45)", conn);
                ExecuteNonQueryInternal("INSERT OR IGNORE INTO Mon(MaMH, TenMH, SoTiet) VALUES(102, 'Cơ sở dữ liệu', 45)", conn);
                ExecuteNonQueryInternal("INSERT OR IGNORE INTO Mon(MaMH, TenMH, SoTiet) VALUES(103, 'Cấu trúc dữ liệu', 45)", conn);
                ExecuteNonQueryInternal("INSERT OR IGNORE INTO Mon(MaMH, TenMH, SoTiet) VALUES(104, 'Mạng máy tính', 45)", conn);
                ExecuteNonQueryInternal("INSERT OR IGNORE INTO Mon(MaMH, TenMH, SoTiet) VALUES(105, 'Hệ điều hành', 45)", conn);
                ExecuteNonQueryInternal("INSERT OR IGNORE INTO Mon(MaMH, TenMH, SoTiet) VALUES(106, 'Tiếng Anh chuyên ngành', 30)", conn);

                ExecuteNonQueryInternal("INSERT OR IGNORE INTO SinhVien(MaSo, HoTen, NgaySinh, GioiTinh, DiaChi, DienThoai, MaKhoa) VALUES(1001, 'Nguyen Van An', '2004-01-12', 1, 'Ha Noi', '0901000001', 1)", conn);
                ExecuteNonQueryInternal("INSERT OR IGNORE INTO SinhVien(MaSo, HoTen, NgaySinh, GioiTinh, DiaChi, DienThoai, MaKhoa) VALUES(1002, 'Tran Thi Bich', '2004-05-23', 0, 'Hai Phong', '0901000002', 1)", conn);
                ExecuteNonQueryInternal("INSERT OR IGNORE INTO SinhVien(MaSo, HoTen, NgaySinh, GioiTinh, DiaChi, DienThoai, MaKhoa) VALUES(1003, 'Le Quoc Cuong', '2003-11-03', 1, 'Da Nang', '0901000003', 2)", conn);
                ExecuteNonQueryInternal("INSERT OR IGNORE INTO SinhVien(MaSo, HoTen, NgaySinh, GioiTinh, DiaChi, DienThoai, MaKhoa) VALUES(1004, 'Pham Thu Dung', '2004-02-18', 0, 'Nam Dinh', '0901000004', 2)", conn);
                ExecuteNonQueryInternal("INSERT OR IGNORE INTO SinhVien(MaSo, HoTen, NgaySinh, GioiTinh, DiaChi, DienThoai, MaKhoa) VALUES(1005, 'Hoang Gia Huy', '2003-09-09', 1, 'Hai Duong', '0901000005', 3)", conn);
                ExecuteNonQueryInternal("INSERT OR IGNORE INTO SinhVien(MaSo, HoTen, NgaySinh, GioiTinh, DiaChi, DienThoai, MaKhoa) VALUES(1006, 'Vu Minh Kha', '2004-07-30', 1, 'Thai Binh', '0901000006', 3)", conn);
                ExecuteNonQueryInternal("INSERT OR IGNORE INTO SinhVien(MaSo, HoTen, NgaySinh, GioiTinh, DiaChi, DienThoai, MaKhoa) VALUES(1007, 'Do Thi Lan', '2004-04-01', 0, 'Bac Ninh', '0901000007', 4)", conn);
                ExecuteNonQueryInternal("INSERT OR IGNORE INTO SinhVien(MaSo, HoTen, NgaySinh, GioiTinh, DiaChi, DienThoai, MaKhoa) VALUES(1008, 'Bui Tuan Minh', '2003-12-14', 1, 'Thanh Hoa', '0901000008', 5)", conn);

                ExecuteNonQueryInternal("INSERT OR IGNORE INTO KetQua(MaSo, MaMH, Diem) VALUES(1001, 101, 8.5)", conn);
                ExecuteNonQueryInternal("INSERT OR IGNORE INTO KetQua(MaSo, MaMH, Diem) VALUES(1001, 102, 7.8)", conn);
                ExecuteNonQueryInternal("INSERT OR IGNORE INTO KetQua(MaSo, MaMH, Diem) VALUES(1001, 103, 8.1)", conn);
                ExecuteNonQueryInternal("INSERT OR IGNORE INTO KetQua(MaSo, MaMH, Diem) VALUES(1002, 101, 7.2)", conn);
                ExecuteNonQueryInternal("INSERT OR IGNORE INTO KetQua(MaSo, MaMH, Diem) VALUES(1002, 106, 8.9)", conn);
                ExecuteNonQueryInternal("INSERT OR IGNORE INTO KetQua(MaSo, MaMH, Diem) VALUES(1003, 102, 8.0)", conn);
                ExecuteNonQueryInternal("INSERT OR IGNORE INTO KetQua(MaSo, MaMH, Diem) VALUES(1003, 104, 7.4)", conn);
                ExecuteNonQueryInternal("INSERT OR IGNORE INTO KetQua(MaSo, MaMH, Diem) VALUES(1004, 102, 6.9)", conn);
                ExecuteNonQueryInternal("INSERT OR IGNORE INTO KetQua(MaSo, MaMH, Diem) VALUES(1004, 105, 7.5)", conn);
                ExecuteNonQueryInternal("INSERT OR IGNORE INTO KetQua(MaSo, MaMH, Diem) VALUES(1005, 103, 8.8)", conn);
                ExecuteNonQueryInternal("INSERT OR IGNORE INTO KetQua(MaSo, MaMH, Diem) VALUES(1005, 104, 7.1)", conn);
                ExecuteNonQueryInternal("INSERT OR IGNORE INTO KetQua(MaSo, MaMH, Diem) VALUES(1006, 101, 6.8)", conn);
                ExecuteNonQueryInternal("INSERT OR IGNORE INTO KetQua(MaSo, MaMH, Diem) VALUES(1006, 105, 7.9)", conn);
                ExecuteNonQueryInternal("INSERT OR IGNORE INTO KetQua(MaSo, MaMH, Diem) VALUES(1007, 106, 8.3)", conn);
                ExecuteNonQueryInternal("INSERT OR IGNORE INTO KetQua(MaSo, MaMH, Diem) VALUES(1008, 104, 7.7)", conn);
            }
        }

        private void ExecuteNonQueryInternal(string query, SQLiteConnection conn)
        {
            using (SQLiteCommand cmd = new SQLiteCommand(query, conn))
            {
                cmd.ExecuteNonQuery();
            }
        }

        public DataTable GetData(string query, params SQLiteParameter[] parameters)
        {
            using (SQLiteConnection conn = new SQLiteConnection(connStr))
            using (SQLiteCommand cmd = new SQLiteCommand(query, conn))
            {
                if (parameters != null)
                    cmd.Parameters.AddRange(parameters);

                using (SQLiteDataAdapter da = new SQLiteDataAdapter(cmd))
                {
                    DataTable dt = new DataTable();
                    da.Fill(dt);
                    return dt;
                }
            }
        }

        public int ExecuteNonQuery(string query, params SQLiteParameter[] parameters)
        {
            using (SQLiteConnection conn = new SQLiteConnection(connStr))
            using (SQLiteCommand cmd = new SQLiteCommand(query, conn))
            {
                if (parameters != null)
                    cmd.Parameters.AddRange(parameters);

                conn.Open();
                return cmd.ExecuteNonQuery();
            }
        }

        public object ExecuteScalar(string query, params SQLiteParameter[] parameters)
        {
            using (SQLiteConnection conn = new SQLiteConnection(connStr))
            using (SQLiteCommand cmd = new SQLiteCommand(query, conn))
            {
                if (parameters != null)
                    cmd.Parameters.AddRange(parameters);

                conn.Open();
                return cmd.ExecuteScalar();
            }
        }
    }
}
