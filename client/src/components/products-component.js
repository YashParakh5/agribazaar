import React from 'react'

import '../shared/stylesheets/products-style.css'
import { Link } from 'react-router-dom';
const setImage = (product) =>{
    if(product.image)
    {
        return(
            <img className="card-img-top" src={`/assets/uploads/${product.image}`} onError={(e)=>{e.target.onerror=null}} alt={product.name}/>                                    
        );
    }
    else{
        return (
            <></>
        )
    }
}
const Products = (props) => {
    return (
        <div className = "products-wrapper">
            <div className="row equal">
                {
                    props.items.map((product,index)=>
                        <div key={index} className="col-lg-3 col-md-4 col-sm-6 col-xs-12" style={{paddingBottom:"1em",height:"100%"}}>
                            <div className="card crop" >
                                <Link to = {{pathname:'/product/'+product.id,items:{props}}}>
                                    {/* {setImage(product)} */}
                                    <div className="card-body">
                                        <h5 className="card-title">{product.name}</h5>
                                    </div>
                                </Link>
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item">{product.description}</li>
                                    <li className="list-group-item">{product.category}</li>
                                    <li className="list-group-item">{product.AvgPrice} Rs/Kg</li>
                                </ul>
                            </div>
                        </div>
                    )
                }
        </div> 
    </div>
    )
};
    

export default Products;