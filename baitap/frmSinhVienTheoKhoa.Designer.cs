namespace StudentManagement
{
    partial class frmSinhVienTheoKhoa
    {
        private System.ComponentModel.IContainer components = null;

        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null)) components.Dispose();
            base.Dispose(disposing);
        }

        private void InitializeComponent()
        {
            this.lblMaKhoa = new System.Windows.Forms.Label();
            this.cboMaKhoa = new System.Windows.Forms.ComboBox();
            this.lblTenKhoa = new System.Windows.Forms.Label();
            this.cboTenKhoa = new System.Windows.Forms.ComboBox();
            this.btnXem = new System.Windows.Forms.Button();
            this.dgvSVTheoKhoa = new System.Windows.Forms.DataGridView();
            ((System.ComponentModel.ISupportInitialize)(this.dgvSVTheoKhoa)).BeginInit();
            this.SuspendLayout();
            
            this.lblMaKhoa.Location = new System.Drawing.Point(30, 30);
            this.lblMaKhoa.Text = "Mã khoa";
            this.cboMaKhoa.Location = new System.Drawing.Point(100, 27);
            this.cboMaKhoa.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.cboMaKhoa.SelectedIndexChanged += new System.EventHandler(this.cboMaKhoa_SelectedIndexChanged);

            this.lblTenKhoa.Location = new System.Drawing.Point(30, 65);
            this.lblTenKhoa.Text = "Tên khoa";
            this.cboTenKhoa.Location = new System.Drawing.Point(100, 62);
            this.cboTenKhoa.Width = 200;
            this.cboTenKhoa.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.cboTenKhoa.SelectedIndexChanged += new System.EventHandler(this.cboTenKhoa_SelectedIndexChanged);
            
            this.btnXem.Location = new System.Drawing.Point(260, 25);
            this.btnXem.Text = "Xem Sinh Viên";
            this.btnXem.Size = new System.Drawing.Size(100, 25);
            this.btnXem.Click += new System.EventHandler(this.btnXem_Click);
            
            this.dgvSVTheoKhoa.Location = new System.Drawing.Point(30, 105);
            this.dgvSVTheoKhoa.Size = new System.Drawing.Size(650, 300);
            this.dgvSVTheoKhoa.AllowUserToAddRows = false;
            this.dgvSVTheoKhoa.ReadOnly = true;
            
            this.ClientSize = new System.Drawing.Size(700, 430);
            this.Controls.Add(this.dgvSVTheoKhoa);
            this.Controls.Add(this.btnXem);
            this.Controls.Add(this.cboTenKhoa);
            this.Controls.Add(this.lblTenKhoa);
            this.Controls.Add(this.cboMaKhoa);
            this.Controls.Add(this.lblMaKhoa);
            this.Name = "frmSinhVienTheoKhoa";
            this.Text = "Xem sinh viên theo khoa";
            this.Load += new System.EventHandler(this.frmSinhVienTheoKhoa_Load);
            ((System.ComponentModel.ISupportInitialize)(this.dgvSVTheoKhoa)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();
        }

        private System.Windows.Forms.Label lblMaKhoa;
        private System.Windows.Forms.ComboBox cboMaKhoa;
        private System.Windows.Forms.Label lblTenKhoa;
        private System.Windows.Forms.ComboBox cboTenKhoa;
        private System.Windows.Forms.Button btnXem;
        private System.Windows.Forms.DataGridView dgvSVTheoKhoa;
    }
}
