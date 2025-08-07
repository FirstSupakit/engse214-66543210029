document.addEventListener('DOMContentLoaded', () => {
    const commentsContainer = document.getElementById('comments-container');
    const commentForm = document.getElementById('comment-form');
    const nameInput = document.getElementById('name-input');
    const commentInput = document.getElementById('comment-input');

    // 1. สร้างฟังก์ชันสำหรับ Sanitize ข้อมูล
    const sanitize = (str) => {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    };

    function displayComments(comments) {
        commentsContainer.innerHTML = '';
        comments.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.classList.add('comment'); // เพิ่ม class 'comment' เพื่อให้สอดคล้องกับ CSS

            // 2. ใช้ฟังก์ชัน sanitize กับข้อมูลที่มาจากผู้ใช้ก่อนแสดงผล
            const safeName = sanitize(comment.name);
            const safeText = sanitize(comment.text);

            commentElement.innerHTML = `
                <div class="comment-author">${safeName}</div>
                <div class="comment-text">${safeText}</div>
            `;
            commentsContainer.appendChild(commentElement);
        });
    }

    async function fetchComments() {
        const response = await fetch('db.json');
        const data = await response.json();
        displayComments(data.comments);
    }

    // 3. เพิ่ม Event Listener สำหรับการ submit ฟอร์ม
    commentForm.addEventListener('submit', async (e) => {
        // ป้องกันการรีเฟรชหน้าเว็บตามค่าเริ่มต้น
        e.preventDefault(); 

        const newComment = {
            name: nameInput.value,
            text: commentInput.value
        };

        try {
            // โค้ดส่วนนี้สมมติว่าคุณมี Back-end/API ที่รองรับการ POST
            // ถ้าคุณใช้ json-server ให้เปลี่ยน URL เป็น 'http://localhost:3000/comments'
            const response = await fetch('http://localhost:3000/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newComment)
            });

            if (!response.ok) {
                throw new Error('Failed to post comment');
            }

            // เมื่อโพสต์สำเร็จ ให้ดึงข้อมูลคอมเมนต์มาแสดงผลใหม่
            fetchComments();
            // ล้างช่อง input
            nameInput.value = '';
            commentInput.value = '';

        } catch (error) {
            console.error('Error posting comment:', error);
            alert('ไม่สามารถโพสต์ความคิดเห็นได้ กรุณาลองใหม่อีกครั้ง');
        }
    });

    // เรียกฟังก์ชันเพื่อดึงข้อมูลคอมเมนต์มาแสดงผลครั้งแรก
    fetchComments();
});