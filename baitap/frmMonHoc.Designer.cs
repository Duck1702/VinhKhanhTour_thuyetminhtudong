namespace StudentManagement
{
    partial class frmMonHoc
    {
        private System.ComponentModel.IContainer components = null;

        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null)) components.Dispose();
            base.Dispose(disposing);
        }

        private void InitializeComponent()
        {
            this.lblMaMH = new System.Windows.Forms.Label();
            this.txtMaMH = new System.Windows.Forms.TextBox();
            this.lblTenMH = new System.Windows.Forms.Label();
            this.txtTenMH = new System.Windows.Forms.TextBox();
            this.lblSoTiet = new System.Windows.Forms.Label();
            this.txtSoTiet = new System.Windows.Forms.TextBox();
            this.btnThem = new System.Windows.Forms.Button();
            this.btnSua = new System.Windows.Forms.Button();
            this.btnXoa = new System.Windows.Forms.Button();
            this.btnLamMoi = new System.Windows.Forms.Button();
            this.dgvMonHoc = new System.Windows.Forms.DataGridView();
            ((System.ComponentModel.ISupportInitialize)(this.dgvMonHoc)).BeginInit();
            this.SuspendLayout();
            
            this.lblMaMH.AutoSize = true;
            this.lblMaMH.Location = new System.Drawing.Point(30, 30);
            this.lblMaMH.Text = "Mã MH:";
            
            this.txtMaMH.Location = new System.Drawing.Point(100, 27);
            
            this.lblTenMH.AutoSize = true;
            this.lblTenMH.Location = new System.Drawing.Point(30, 70);
            this.lblTenMH.Text = "Tên MH:";
            
            this.txtTenMH.Location = new System.Drawing.Point(100, 67);
            
            this.lblSoTiet.AutoSize = true;
            this.lblSoTiet.Location = new System.Drawing.Point(30, 110);
            this.lblSoTiet.Text = "Số Tiết:";
            
            this.txtSoTiet.Location = new System.Drawing.Point(100, 107);
            
            this.btnThem.Location = new System.Drawing.Point(230, 25);
            this.btnThem.Text = "Thêm";
            this.btnThem.Click += new System.EventHandler(this.btnThem_Click);
            
            this.btnSua.Location = new System.Drawing.Point(230, 65);
            this.btnSua.Text = "Sửa";
            this.btnSua.Click += new System.EventHandler(this.btnSua_Click);
            
            this.btnXoa.Location = new System.Drawing.Point(320, 25);
            this.btnXoa.Text = "Xóa";
            this.btnXoa.Click += new System.EventHandler(this.btnXoa_Click);
            
            this.btnLamMoi.Location = new System.Drawing.Point(320, 65);
            this.btnLamMoi.Text = "Làm mới";
            this.btnLamMoi.Click += new System.EventHandler(this.btnLamMoi_Click);
            
            this.dgvMonHoc.Location = new System.Drawing.Point(30, 150);
            this.dgvMonHoc.Size = new System.Drawing.Size(465, 200);
            this.dgvMonHoc.AllowUserToAddRows = false;
            this.dgvMonHoc.ReadOnly = true;
            this.dgvMonHoc.CellClick += new System.Windows.Forms.DataGridViewCellEventHandler(this.dgvMonHoc_CellClick);
            
            this.ClientSize = new System.Drawing.Size(530, 380);
            this.Controls.Add(this.dgvMonHoc);
            this.Controls.Add(this.btnLamMoi);
            this.Controls.Add(this.btnXoa);
            this.Controls.Add(this.btnSua);
            this.Controls.Add(this.btnThem);
            this.Controls.Add(this.txtSoTiet);
            this.Controls.Add(this.lblSoTiet);
            this.Controls.Add(this.txtTenMH);
            this.Controls.Add(this.lblTenMH);
            this.Controls.Add(this.txtMaMH);
            this.Controls.Add(this.lblMaMH);
            this.Name = "frmMonHoc";
            this.Text = "Danh mục môn học";
            this.Load += new System.EventHandler(this.frmMonHoc_Load);
            ((System.ComponentModel.ISupportInitialize)(this.dgvMonHoc)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();
        }
        
        private System.Windows.Forms.Label lblMaMH;
        private System.Windows.Forms.TextBox txtMaMH;
        private System.Windows.Forms.Label lblTenMH;
        private System.Windows.Forms.TextBox txtTenMH;
        private System.Windows.Forms.Label lblSoTiet;
        private System.Windows.Forms.TextBox txtSoTiet;
        private System.Windows.Forms.Button btnThem;
        private System.Windows.Forms.Button btnSua;
        private System.Windows.Forms.Button btnXoa;
        private System.Windows.Forms.Button btnLamMoi;
        private System.Windows.Forms.DataGridView dgvMonHoc;
    }
}
