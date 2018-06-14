import React from 'react';
import CategoryItem from './CategoryItem/CategoryItem';

const category = (props) => {

    let completedCourses = props.courses.map(course => {
        return <CategoryItem 
                    key={course.sc_no} 
                    {...course} />;
    });

    return (
        <div className="list-group-item clearfix">
            <div className="pull-left">
                <h4 className="list-group-item-heading">
                    {props.name}
                </h4>

                <table id="courses-list" className="table">
                    <thead>
                        <tr>
                            <th className="completed">Completed</th>
                            <th className="course">Course</th>
                            <th className="ceu">CEU</th>
                            <th>&nbsp;</th>
                            <th>&nbsp;</th>
                        </tr>    
                    </thead>
                    
                    <tbody>
                        {completedCourses}
                    </tbody>

                </table>

            </div>
        </div>
    );
};

export default category;