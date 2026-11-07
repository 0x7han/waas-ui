import { Link } from 'react-router'

function NotFoundPage() {
  return (
    <section id="center">
      <div>
        <h1>404 — Page not found</h1>
        <p>Halaman yang kamu cari tidak tersedia.</p>
        <p>
          <Link to="/">Kembali ke beranda</Link>
        </p>
      </div>
    </section>
  )
}

export default NotFoundPage
