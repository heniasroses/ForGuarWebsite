export default function Team() {
  const members = [
    {
      name: "Leonabel Alcantara",
      roles: ["UI Designer", "Concept Artist"],
      image: "/img/leonabel.png",
    },
    {
      name: "Andrie Detera",
      roles: ["Game Designer", "Programmer"],
      image: "/img/andrie.png",
    },
    {
      name: "Angel Janica Fabregas",
      roles: ["3D Artist", "Animator"],
      image: "/img/angel.png",
    },
    {
      name: "Heniarose Crishia Guansing",
      roles: ["Project Leader", "Document Specialist"],
      image: "/img/crishia.png",
    },
  ];

  return (
    <div className="container-fluid Team-container">
      <div className="row team-row">
        {members.map((member, index) => (
          <div key={index} className="col-md-3 team-member">
            <img src={member.image} alt={member.name} className="team-image" />

            <h4>{member.name}</h4>

            <p className="team-roles">
              {member.roles.map((role, i) => (
                <span key={i}>{role}</span>
              ))}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}