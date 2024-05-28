// src/app/(afterLogin)/_components/ProfileCard.jsx

export default function ProfileCard({ title, content }) {
    return (
      <div className="profile-card">
        <p className="title">{title}</p>
        <p className="content">{content}</p>
        <style jsx>{`
          .profile-card {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            border: 1px solid #ccc;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            background-color: #fff;
            width: 400px;
            height: 200px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .title {
            margin: 0;
            font-size: 1.5rem;
            font-weight: bold;
          }
          .content {
            margin: 0;
            font-size: 2rem;
            font-weight: bold;
            margin-top: 0.5rem;
          }
        `}</style>
      </div>
    );
  }
  