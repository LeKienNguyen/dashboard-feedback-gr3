(function () {
  const links = [
    { href: 'submit.html', label: 'Gửi phản hồi' },
    { href: 'admin.html',  label: 'Quản trị'     },
  ]

  const current = location.pathname.split('/').pop()

  const navHTML = `
    <nav class="bg-white border-b border-gray-200 shadow-sm">
      <div class="max-w-5xl mx-auto px-6 flex items-center justify-between h-14">
        <span class="font-semibold text-gray-800 text-base tracking-tight">
          Phản hồi khách hàng
        </span>
        <ul class="flex gap-1">
          ${links.map(({ href, label }) => {
            const active = href === current
            return `<li>
              <a href="${href}"
                 class="inline-block px-4 py-1.5 rounded-md text-sm font-medium transition-colors
                        ${active
                          ? 'bg-indigo-600 text-white'
                          : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'}">
                ${label}
              </a>
            </li>`
          }).join('')}
        </ul>
      </div>
    </nav>`

  document.getElementById('app-nav').innerHTML = navHTML
})()
