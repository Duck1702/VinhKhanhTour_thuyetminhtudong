namespace StudentManagement
{
    partial class MainForm
    {
        private System.ComponentModel.IContainer components = null;

        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        private void InitializeComponent()
        {
            this.menuStrip1 = new System.Windows.Forms.MenuStrip();
            this.mnuHeThong = new System.Windows.Forms.ToolStripMenuItem();
            this.mnuThoat = new System.Windows.Forms.ToolStripMenuItem();
            this.mnuChucNang = new System.Windows.Forms.ToolStripMenuItem();
            this.mnuSinhVien = new System.Windows.Forms.ToolStripMenuItem();
            this.mnuKhoa = new System.Windows.Forms.ToolStripMenuItem();
            this.mnuMonHoc = new System.Windows.Forms.ToolStripMenuItem();
            this.mnuNhapDiem = new System.Windows.Forms.ToolStripMenuItem();
            this.mnuXemDiem = new System.Windows.Forms.ToolStripMenuItem();
            this.mnuSVTheoKhoa = new System.Windows.Forms.ToolStripMenuItem();
            this.mnuHoTro = new System.Windows.Forms.ToolStripMenuItem();
            this.mnuGioiThieu = new System.Windows.Forms.ToolStripMenuItem();
            this.toolStrip1 = new System.Windows.Forms.ToolStrip();
            this.btnSinhVien = new System.Windows.Forms.ToolStripButton();
            this.btnKhoa = new System.Windows.Forms.ToolStripButton();
            this.btnMonHoc = new System.Windows.Forms.ToolStripButton();
            this.btnNhapDiem = new System.Windows.Forms.ToolStripButton();
            this.btnXemDiem = new System.Windows.Forms.ToolStripButton();
            this.btnThongKeKhoa = new System.Windows.Forms.ToolStripButton();
            this.toolStripSeparator1 = new System.Windows.Forms.ToolStripSeparator();
            this.btnThoat = new System.Windows.Forms.ToolStripButton();
            this.statusStrip1 = new System.Windows.Forms.StatusStrip();
            this.lblTrangThai = new System.Windows.Forms.ToolStripStatusLabel();
            this.lblNguoiDung = new System.Windows.Forms.ToolStripStatusLabel();
            this.menuStrip1.SuspendLayout();
            this.toolStrip1.SuspendLayout();
            this.statusStrip1.SuspendLayout();
            this.SuspendLayout();
            
            // menuStrip1
            this.menuStrip1.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.mnuHeThong,
            this.mnuChucNang,
            this.mnuHoTro});
            this.menuStrip1.Location = new System.Drawing.Point(0, 0);
            this.menuStrip1.Name = "menuStrip1";
            this.menuStrip1.Size = new System.Drawing.Size(800, 24);
            this.menuStrip1.TabIndex = 1;
            this.menuStrip1.Text = "menuStrip1";
            
            // mnuHeThong
            this.mnuHeThong.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.mnuThoat});
            this.mnuHeThong.Name = "mnuHeThong";
            this.mnuHeThong.Size = new System.Drawing.Size(69, 20);
            this.mnuHeThong.Text = "Hệ thống";
            
            // mnuThoat
            this.mnuThoat.Name = "mnuThoat";
            this.mnuThoat.Size = new System.Drawing.Size(180, 22);
            this.mnuThoat.Text = "Thoát";
            this.mnuThoat.Click += new System.EventHandler((s, e) => this.Close());
            
            // mnuChucNang
            this.mnuChucNang.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.mnuSinhVien,
            this.mnuKhoa,
            this.mnuMonHoc,
            this.mnuNhapDiem,
            this.mnuXemDiem,
            this.mnuSVTheoKhoa});
            this.mnuChucNang.Name = "mnuChucNang";
            this.mnuChucNang.Size = new System.Drawing.Size(77, 20);
            this.mnuChucNang.Text = "Chức năng";

            // mnuSinhVien
            this.mnuSinhVien.Name = "mnuSinhVien";
            this.mnuSinhVien.Size = new System.Drawing.Size(180, 22);
            this.mnuSinhVien.Text = "Sinh viên";
            this.mnuSinhVien.Click += new System.EventHandler(this.mnuSinhVien_Click);
            
            // mnuKhoa
            this.mnuKhoa.Name = "mnuKhoa";
            this.mnuKhoa.Size = new System.Drawing.Size(180, 22);
            this.mnuKhoa.Text = "Khoa";
            this.mnuKhoa.Click += new System.EventHandler(this.mnuKhoa_Click);
            
            // mnuMonHoc
            this.mnuMonHoc.Name = "mnuMonHoc";
            this.mnuMonHoc.Size = new System.Drawing.Size(180, 22);
            this.mnuMonHoc.Text = "Môn học";
            this.mnuMonHoc.Click += new System.EventHandler(this.mnuMonHoc_Click);
            
            // mnuNhapDiem
            this.mnuNhapDiem.Name = "mnuNhapDiem";
            this.mnuNhapDiem.Size = new System.Drawing.Size(180, 22);
            this.mnuNhapDiem.Text = "Nhập điểm";
            this.mnuNhapDiem.Click += new System.EventHandler(this.mnuNhapDiem_Click);
            
            // mnuXemDiem
            this.mnuXemDiem.Name = "mnuXemDiem";
            this.mnuXemDiem.Size = new System.Drawing.Size(180, 22);
            this.mnuXemDiem.Text = "Xem điểm";
            this.mnuXemDiem.Click += new System.EventHandler(this.mnuXemDiem_Click);
            
            // mnuSVTheoKhoa
            this.mnuSVTheoKhoa.Name = "mnuSVTheoKhoa";
            this.mnuSVTheoKhoa.Size = new System.Drawing.Size(180, 22);
            this.mnuSVTheoKhoa.Text = "SV theo khoa";
            this.mnuSVTheoKhoa.Click += new System.EventHandler(this.mnuSVTheoKhoa_Click);

            // mnuHoTro
            this.mnuHoTro.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.mnuGioiThieu});
            this.mnuHoTro.Name = "mnuHoTro";
            this.mnuHoTro.Size = new System.Drawing.Size(58, 20);
            this.mnuHoTro.Text = "Hỗ trợ";

            // mnuGioiThieu
            this.mnuGioiThieu.Name = "mnuGioiThieu";
            this.mnuGioiThieu.Size = new System.Drawing.Size(127, 22);
            this.mnuGioiThieu.Text = "Giới thiệu";
            this.mnuGioiThieu.Click += new System.EventHandler(this.mnuGioiThieu_Click);

            // toolStrip1
            this.toolStrip1.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.btnSinhVien,
            this.btnKhoa,
            this.btnMonHoc,
            this.btnNhapDiem,
            this.btnXemDiem,
            this.btnThongKeKhoa,
            this.toolStripSeparator1,
            this.btnThoat});
            this.toolStrip1.Location = new System.Drawing.Point(0, 24);
            this.toolStrip1.Name = "toolStrip1";
            this.toolStrip1.Size = new System.Drawing.Size(800, 39);
            this.toolStrip1.TabIndex = 2;
            this.toolStrip1.Text = "toolStrip1";

            // btnSinhVien
            this.btnSinhVien.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.btnSinhVien.Name = "btnSinhVien";
            this.btnSinhVien.Size = new System.Drawing.Size(58, 36);
            this.btnSinhVien.Text = "Sinh viên";
            this.btnSinhVien.TextImageRelation = System.Windows.Forms.TextImageRelation.ImageAboveText;
            this.btnSinhVien.Click += new System.EventHandler(this.mnuSinhVien_Click);

            // btnKhoa
            this.btnKhoa.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.btnKhoa.Name = "btnKhoa";
            this.btnKhoa.Size = new System.Drawing.Size(37, 36);
            this.btnKhoa.Text = "Khoa";
            this.btnKhoa.TextImageRelation = System.Windows.Forms.TextImageRelation.ImageAboveText;
            this.btnKhoa.Click += new System.EventHandler(this.mnuKhoa_Click);

            // btnMonHoc
            this.btnMonHoc.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.btnMonHoc.Name = "btnMonHoc";
            this.btnMonHoc.Size = new System.Drawing.Size(56, 36);
            this.btnMonHoc.Text = "Môn học";
            this.btnMonHoc.TextImageRelation = System.Windows.Forms.TextImageRelation.ImageAboveText;
            this.btnMonHoc.Click += new System.EventHandler(this.mnuMonHoc_Click);

            // btnNhapDiem
            this.btnNhapDiem.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.btnNhapDiem.Name = "btnNhapDiem";
            this.btnNhapDiem.Size = new System.Drawing.Size(67, 36);
            this.btnNhapDiem.Text = "Nhập điểm";
            this.btnNhapDiem.TextImageRelation = System.Windows.Forms.TextImageRelation.ImageAboveText;
            this.btnNhapDiem.Click += new System.EventHandler(this.mnuNhapDiem_Click);

            // btnXemDiem
            this.btnXemDiem.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.btnXemDiem.Name = "btnXemDiem";
            this.btnXemDiem.Size = new System.Drawing.Size(62, 36);
            this.btnXemDiem.Text = "Xem điểm";
            this.btnXemDiem.TextImageRelation = System.Windows.Forms.TextImageRelation.ImageAboveText;
            this.btnXemDiem.Click += new System.EventHandler(this.mnuXemDiem_Click);

            // btnThongKeKhoa
            this.btnThongKeKhoa.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.btnThongKeKhoa.Name = "btnThongKeKhoa";
            this.btnThongKeKhoa.Size = new System.Drawing.Size(88, 36);
            this.btnThongKeKhoa.Text = "Thống kê khoa";
            this.btnThongKeKhoa.TextImageRelation = System.Windows.Forms.TextImageRelation.ImageAboveText;
            this.btnThongKeKhoa.Click += new System.EventHandler(this.mnuSVTheoKhoa_Click);

            // toolStripSeparator1
            this.toolStripSeparator1.Name = "toolStripSeparator1";
            this.toolStripSeparator1.Size = new System.Drawing.Size(6, 39);

            // btnThoat
            this.btnThoat.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.btnThoat.Name = "btnThoat";
            this.btnThoat.Size = new System.Drawing.Size(39, 36);
            this.btnThoat.Text = "Thoát";
            this.btnThoat.TextImageRelation = System.Windows.Forms.TextImageRelation.ImageAboveText;
            this.btnThoat.Click += new System.EventHandler((s, e) => this.Close());

            // statusStrip1
            this.statusStrip1.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.lblTrangThai,
            this.lblNguoiDung});
            this.statusStrip1.Location = new System.Drawing.Point(0, 428);
            this.statusStrip1.Name = "statusStrip1";
            this.statusStrip1.Size = new System.Drawing.Size(800, 22);
            this.statusStrip1.TabIndex = 3;
            this.statusStrip1.Text = "statusStrip1";

            // lblTrangThai
            this.lblTrangThai.Name = "lblTrangThai";
            this.lblTrangThai.Size = new System.Drawing.Size(39, 17);
            this.lblTrangThai.Text = "Ready";

            // lblNguoiDung
            this.lblNguoiDung.Name = "lblNguoiDung";
            this.lblNguoiDung.Size = new System.Drawing.Size(746, 17);
            this.lblNguoiDung.Spring = true;
            this.lblNguoiDung.Text = "HaGiang";
            this.lblNguoiDung.TextAlign = System.Drawing.ContentAlignment.MiddleRight;
            
            // MainForm
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(800, 450);
            this.Controls.Add(this.statusStrip1);
            this.Controls.Add(this.toolStrip1);
            this.Controls.Add(this.menuStrip1);
            this.IsMdiContainer = true;
            this.MainMenuStrip = this.menuStrip1;
            this.Name = "MainForm";
            this.Text = "Quản lý sinh viên";
            this.menuStrip1.ResumeLayout(false);
            this.menuStrip1.PerformLayout();
            this.toolStrip1.ResumeLayout(false);
            this.toolStrip1.PerformLayout();
            this.statusStrip1.ResumeLayout(false);
            this.statusStrip1.PerformLayout();
            this.ResumeLayout(false);
            this.PerformLayout();
        }

        private System.Windows.Forms.MenuStrip menuStrip1;
        private System.Windows.Forms.ToolStripMenuItem mnuHeThong;
        private System.Windows.Forms.ToolStripMenuItem mnuThoat;
        private System.Windows.Forms.ToolStripMenuItem mnuChucNang;
        private System.Windows.Forms.ToolStripMenuItem mnuSinhVien;
        private System.Windows.Forms.ToolStripMenuItem mnuKhoa;
        private System.Windows.Forms.ToolStripMenuItem mnuMonHoc;
        private System.Windows.Forms.ToolStripMenuItem mnuNhapDiem;
        private System.Windows.Forms.ToolStripMenuItem mnuXemDiem;
        private System.Windows.Forms.ToolStripMenuItem mnuSVTheoKhoa;
        private System.Windows.Forms.ToolStripMenuItem mnuHoTro;
        private System.Windows.Forms.ToolStripMenuItem mnuGioiThieu;
        private System.Windows.Forms.ToolStrip toolStrip1;
        private System.Windows.Forms.ToolStripButton btnSinhVien;
        private System.Windows.Forms.ToolStripButton btnKhoa;
        private System.Windows.Forms.ToolStripButton btnMonHoc;
        private System.Windows.Forms.ToolStripButton btnNhapDiem;
        private System.Windows.Forms.ToolStripButton btnXemDiem;
        private System.Windows.Forms.ToolStripButton btnThongKeKhoa;
        private System.Windows.Forms.ToolStripSeparator toolStripSeparator1;
        private System.Windows.Forms.ToolStripButton btnThoat;
        private System.Windows.Forms.StatusStrip statusStrip1;
        private System.Windows.Forms.ToolStripStatusLabel lblTrangThai;
        private System.Windows.Forms.ToolStripStatusLabel lblNguoiDung;
    }
}
